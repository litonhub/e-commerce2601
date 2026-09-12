// src/services/blogService.js
//
// New abstraction — the original app had no blogApi/blogService file;
// Blog.jsx, SingleBlog.jsx, and the three admin blog pages all called
// `api.get/post/put/delete` directly. This centralizes all of that
// against local dummy data (seeded from src/data/blogs.js), the same
// approach used for auth in an earlier phase.

import seedBlogs from "../data/blogs";
import categories from "../data/categories";
import {
  simulateDelay,
  mockError,
  mockResponse,
  generateId,
  localizedText,
  slugify,
  parseTagsInput,
  fileToDataUrl,
  createLocalStore,
  readLocal,
  writeLocal,
} from "../utils/mockApi";

const blogStore = createLocalStore("localBlogs", seedBlogs);
const COMMENTS_KEY = "localBlogComments";

const readComments = () => readLocal(COMMENTS_KEY, []);
const writeComments = (list) => writeLocal(COMMENTS_KEY, list);

const publishedBlogs = () => blogStore.read().filter((b) => b.status === "published");

// ---------------------------------------------------------------------
// Storefront
// ---------------------------------------------------------------------

export const getBlogSidebarData = async () => {
  await simulateDelay();

  const blogs = publishedBlogs();
  const recentPosts = [...blogs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4);
  const tagSet = new Set();
  blogs.forEach((b) => (b.tags?.en || []).forEach((t) => tagSet.add(t)));

  const categoriesWithCounts = categories
    .filter((c) => c.status === "active")
    .map((c) => ({ ...c, count: blogs.filter((b) => b.category?._id === c._id).length }));

  return mockResponse({
    categories: categoriesWithCounts,
    tags: Array.from(tagSet),
    galleryImages: blogs.map((b) => b.image).slice(0, 8),
    recentPosts,
  });
};

export const getBlogs = async (params = {}) => {
  await simulateDelay();

  let result = publishedBlogs();

  if (params.search) {
    const q = String(params.search).toLowerCase();
    result = result.filter((b) => localizedText(b.title, "en").toLowerCase().includes(q));
  }
  if (params.category) {
    result = result.filter((b) => b.category?._id === params.category);
  }
  if (params.tag) {
    result = result.filter((b) => (b.tags?.en || []).includes(params.tag));
  }

  result = [...result].sort((a, b) =>
    params.sort === "Oldest" ? new Date(a.createdAt) - new Date(b.createdAt) : new Date(b.createdAt) - new Date(a.createdAt)
  );

  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 6;
  const start = (page - 1) * limit;
  const paginated = result.slice(start, start + limit).map((b) => ({
    ...b,
    commentCount: readComments().filter((c) => c.blogId === b._id).length,
  }));

  return {
    data: paginated,
    totalResults: result.length,
    totalPages: Math.max(1, Math.ceil(result.length / limit)),
  };
};

export const getSingleBlog = async (slug) => {
  await simulateDelay();

  const blog = publishedBlogs().find((b) => b.slug === slug);
  if (!blog) {
    mockError(404, "Blog post not found");
  }

  const comments = readComments()
    .filter((c) => c.blogId === blog._id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return mockResponse({ blog, comments, commentCount: comments.length });
};

export const submitBlogComment = async ({ blogId, fullName, email, message }) => {
  await simulateDelay(300);

  if (!fullName?.trim() || !email?.trim() || !message?.trim()) {
    mockError(400, "Please fill in all fields.");
  }

  const comments = readComments();
  comments.push({
    _id: `comment-${generateId()}`,
    blogId,
    fullName: fullName.trim(),
    email: email.trim(),
    message: message.trim(),
    createdAt: new Date().toISOString(),
  });
  writeComments(comments);

  return { success: true, message: "Comment posted successfully!" };
};

// ---------------------------------------------------------------------
// Admin
// ---------------------------------------------------------------------

export const getAdminBlogs = async () => {
  await simulateDelay();
  return mockResponse([...blogStore.read()].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
};

export const getAdminBlogById = async (id) => {
  await simulateDelay();
  const blog = blogStore.read().find((b) => b._id === id);
  if (!blog) mockError(404, "Blog post not found");
  return mockResponse(blog);
};

export const createBlog = async (formData) => {
  await simulateDelay(500);

  const get = (key) => formData.get(key);
  const blogs = blogStore.read();
  const titleEn = get("titleEn") || "";
  const slug = slugify(titleEn, blogs.map((b) => b.slug));

  const imageFile = get("image");
  const imageUrl = imageFile && imageFile.size > 0 ? await fileToDataUrl(imageFile) : "";

  const categoryId = get("category");
  const category = categories.find((c) => c._id === categoryId);

  const newBlog = {
    _id: `blog-${generateId()}`,
    slug,
    title: { en: titleEn, bn: get("titleBn") || "" },
    content: { en: get("contentEn") || "", bn: get("contentBn") || "" },
    category: category ? { _id: category._id, name: category.name } : { name: { en: "General", bn: "সাধারণ" } },
    tags: { en: parseTagsInput(get("tagsEn")), bn: parseTagsInput(get("tagsBn")) },
    author: { name: "Admin", avatar: null },
    image: imageUrl,
    type: get("type") || "image",
    status: get("status") || "published",
    readTime: get("readTime") || "5 min read",
    createdAt: new Date().toISOString(),
  };

  blogs.push(newBlog);
  blogStore.write(blogs);

  return mockResponse({ success: true, message: "Blog created successfully!", data: newBlog });
};

export const updateBlog = async (id, formData) => {
  await simulateDelay(500);

  const blogs = blogStore.read();
  const blog = blogs.find((b) => b._id === id);
  if (!blog) mockError(404, "Blog post not found");

  const get = (key) => formData.get(key);
  blog.title = { en: get("titleEn") || "", bn: get("titleBn") || "" };
  blog.content = { en: get("contentEn") || "", bn: get("contentBn") || "" };
  blog.tags = { en: parseTagsInput(get("tagsEn")), bn: parseTagsInput(get("tagsBn")) };
  blog.type = get("type") || blog.type;
  blog.status = get("status") || blog.status;
  blog.readTime = get("readTime") || blog.readTime;

  const categoryId = get("category");
  const category = categories.find((c) => c._id === categoryId);
  if (category) blog.category = { _id: category._id, name: category.name };

  const imageFile = get("image");
  if (imageFile && imageFile.size > 0) {
    blog.image = await fileToDataUrl(imageFile);
  }

  blogStore.write(blogs);

  return mockResponse({ success: true, message: "Blog updated successfully!", data: blog });
};

export const deleteBlog = async (id) => {
  await simulateDelay(300);
  const blogs = blogStore.read().filter((b) => b._id !== id);
  blogStore.write(blogs);
  return { success: true, message: "Blog deleted successfully" };
};
