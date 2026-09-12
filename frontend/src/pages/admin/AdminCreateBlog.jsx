import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import JoditEditor from 'jodit-react';
import { getCategories } from "../../api/categoryApi";
import { createBlog } from "../../services/blogService";
import { FiImage, FiX } from 'react-icons/fi';

const AdminCreateBlog = () => {
  const navigate = useNavigate();
  const editorEn = useRef(null);
  const editorBn = useRef(null);

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  
  const [titleEn, setTitleEn] = useState("");
  const [titleBn, setTitleBn] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("image");
  const [status, setStatus] = useState("published");
  const [tagsEn, setTagsEn] = useState("");
  const [tagsBn, setTagsBn] = useState("");
  const [readTime, setReadTime] = useState("");
  const [contentEn, setContentEn] = useState("");
  const [contentBn, setContentBn] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const config = useMemo(() => ({
    readonly: false,
    placeholder: 'Write your content here...',
    height: 350,
    statusbar: false,
    buttons: [
      'bold', 'italic', 'underline', 'strikethrough', '|',
      'ul', 'ol', '|',
      'outdent', 'indent', '|',
      'font', 'fontsize', 'brush', 'paragraph', '|',
      'image', 'table', 'link', '|',
      'align', 'undo', 'redo', 'hr', 'eraser', 'fullsize'
    ]
  }), []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        setCategories(res.data.data || []);
      } catch (error) {
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titleEn || !category || !contentEn || !imageFile) {
      toast.error("English Title, Category, English Content, and Image are required!");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("titleEn", titleEn);
      formData.append("titleBn", titleBn);
      formData.append("contentEn", contentEn);
      formData.append("contentBn", contentBn);
      formData.append("category", category);
      formData.append("type", type);
      formData.append("status", status);
      formData.append("readTime", readTime || "5 min read");
      formData.append("tagsEn", tagsEn);
      formData.append("tagsBn", tagsBn);
      formData.append("image", imageFile); 

      const res = await createBlog(formData);

      toast.success(res.data.message || "Blog published successfully!");
      navigate("/admin-dashboard/blogs");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto font-pop">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create New Blog</h1>
        <button onClick={() => navigate("/admin-dashboard/blogs")} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition">
          Cancel
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Blog Title (English) <span className="text-red-500">*</span></label>
              <input type="text" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} placeholder="Enter English title" className="w-full border border-gray-300 rounded-md px-4 py-2.5 outline-none focus:border-[#00B207] transition text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Blog Title (Bangla)</label>
              <input type="text" value={titleBn} onChange={(e) => setTitleBn(e.target.value)} placeholder="বাংলা টাইটেল লিখুন" className="w-full border border-gray-300 rounded-md px-4 py-2.5 outline-none focus:border-[#00B207] transition text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category <span className="text-red-500">*</span></label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border border-gray-300 rounded-md px-4 py-2.5 outline-none focus:border-[#00B207] transition text-sm bg-white">
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name?.en || cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Blog Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="w-full border border-gray-300 rounded-md px-4 py-2.5 outline-none focus:border-[#00B207] transition text-sm bg-white">
                <option value="image">Standard (Image)</option>
                <option value="video">Video Post</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full border border-gray-300 rounded-md px-4 py-2.5 outline-none focus:border-[#00B207] transition text-sm bg-white">
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags (English)</label>
              <input type="text" value={tagsEn} onChange={(e) => setTagsEn(e.target.value)} placeholder="Healthy, Fresh" className="w-full border border-gray-300 rounded-md px-4 py-2.5 outline-none focus:border-[#00B207] transition text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags (Bangla)</label>
              <input type="text" value={tagsBn} onChange={(e) => setTagsBn(e.target.value)} placeholder="স্বাস্থ্যকর, তাজা" className="w-full border border-gray-300 rounded-md px-4 py-2.5 outline-none focus:border-[#00B207] transition text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Read Time</label>
              <input type="text" value={readTime} onChange={(e) => setReadTime(e.target.value)} placeholder="5 min read" className="w-full border border-gray-300 rounded-md px-4 py-2.5 outline-none focus:border-[#00B207] transition text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image <span className="text-red-500">*</span></label>
            {!imagePreview ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center hover:bg-gray-50 transition cursor-pointer relative">
                <FiImage className="w-8 h-8 text-gray-400 mb-3" />
                <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              </div>
            ) : (
              <div className="relative w-full sm:w-1/2 h-48 rounded-lg overflow-hidden border border-gray-200">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <button type="button" onClick={removeImage} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition shadow-md"><FiX size={16} /></button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Blog Content (English) <span className="text-red-500">*</span></label>
            <div className="mb-6">
              <JoditEditor
                ref={editorEn}
                value={contentEn}
                config={config}
                tabIndex={1}
                onBlur={(newContent) => setContentEn(newContent)}
                onChange={(newContent) => {}}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Blog Content (Bangla)</label>
            <div className="mb-12">
              <JoditEditor
                ref={editorBn}
                value={contentBn}
                config={config}
                tabIndex={2}
                onBlur={(newContent) => setContentBn(newContent)}
                onChange={(newContent) => {}}
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button type="submit" disabled={loading} className="px-8 py-3 bg-[#00B207] text-white rounded-md font-medium hover:bg-[#009206] transition disabled:opacity-60">
              {loading ? "Publishing..." : "Publish Blog"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCreateBlog;