import { useState, useEffect } from "react";
import { Link } from "react-router";
import { toast } from "react-toastify";
import { Edit, Trash2, Plus } from "lucide-react";
import { getAllCategories, deleteCategory } from "../../api/categoryApi";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const res = await getAllCategories({ includeInactive: true });
      setCategories(res.data.data);
    } catch (error) {
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      await deleteCategory(id);
      toast.success("Category deleted successfully");
      setCategories(categories.filter((cat) => cat._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete category");
    }
  };

  return (
    <div className="mx-auto max-w-6xl rounded-2xl bg-white p-8 shadow-sm border border-brdr font-pop">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-brdr pb-5">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Category List</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your store categories.</p>
        </div>
        <Link
          to="/admin-dashboard/categories/add"
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-md active:scale-95"
        >
          <Plus size={18} />
          Add Category
        </Link>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="py-10 text-center text-gray-500">Loading categories...</div>
        ) : (
          <table className="w-full min-w-[800px] text-left border-collapse">
            <thead>
              <tr className="border-b border-brdr bg-gray-50/50 text-sm font-semibold text-gray-700">
                <th className="p-4 rounded-tl-xl">Image</th>
                <th className="p-4">Name (EN / BN)</th>
                <th className="p-4">Description</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center rounded-tr-xl">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category._id} className="border-b border-gray-100 hover:bg-gray-50/30 transition-colors">
                  <td className="p-4">
                    <div className="h-12 w-12 rounded-lg border border-brdr bg-white overflow-hidden flex items-center justify-center">
                      <img
                        src={category.image?.url || "/placeholder.jpg"}
                        alt={category.name?.en || category.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900 text-sm">
                        {typeof category.name === "object" ? category.name.en : category.name}
                      </span>
                      {typeof category.name === "object" && category.name.bn && (
                        <span className="text-xs text-gray-500 mt-0.5">{category.name.bn}</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600 truncate max-w-[200px]">
                    {category.description || "-"}
                  </td>
                  <td className="p-4">
                    {category.isPopular && (
                      <span className="bg-orange-100 text-orange-600 text-xs font-semibold px-2.5 py-1 rounded-full">
                        Popular
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-3">
                      <Link
                        to={`/admin-dashboard/categories/edit/${category.slug}`}
                        className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(category._id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-10 text-center text-gray-500 text-sm">
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CategoryList;