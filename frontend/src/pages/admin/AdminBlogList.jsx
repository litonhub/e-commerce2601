import React from "react";
import { Link, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import { toast } from "react-toastify";
import { getAdminBlogs, deleteBlog } from "../../services/blogService";

const AdminBlogList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: blogs, isLoading } = useQuery({
    queryKey: ["adminBlogs"],
    queryFn: async () => {
      const res = await getAdminBlogs();
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await deleteBlog(id);
    },
    onSuccess: (data) => {
      toast.success(data.message || "Blog deleted successfully");
      queryClient.invalidateQueries(["adminBlogs"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete blog");
    }
  });

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this blog? This action cannot be undone.")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading blogs...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto font-pop">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all your blog posts from here</p>
        </div>
        <Link 
          to="/admin-dashboard/blogs/create" 
          className="bg-[#00B207] hover:bg-[#009206] text-white px-5 py-2.5 rounded-md font-medium transition flex items-center gap-2 shadow-sm"
        >
          <FiPlus size={18} /> Add New Blog
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
                <th className="px-6 py-4 font-medium">Image & Title (EN)</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Author</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {blogs && blogs.length > 0 ? (
                blogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img src={blog.image} alt={blog.title?.en} className="w-12 h-12 rounded object-cover bg-gray-100" />
                        <span className="font-medium text-gray-900 line-clamp-2 max-w-xs">{blog.title?.en || "N/A"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {blog.category?.name?.en || blog.category?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {blog.author?.name || "Admin"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                        blog.status === "published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {blog.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button 
                          onClick={() => navigate(`/admin-dashboard/blogs/edit/${blog._id}`)}
                          className="text-gray-400 hover:text-blue-500 transition cursor-pointer"
                        >
                          <FiEdit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(blog._id)}
                          disabled={deleteMutation.isPending}
                          className="text-gray-400 hover:text-red-500 transition cursor-pointer disabled:opacity-50"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                    No blogs found. Create your first blog!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBlogList;