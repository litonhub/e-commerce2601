import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { UploadCloud } from "lucide-react";
import { getSingleCategory, updateCategory } from "../../api/categoryApi";

const EditCategory = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [categoryId, setCategoryId] = useState("");

  const [form, setForm] = useState({
    nameEn: "",
    nameBn: "",
    description: "",
    isPopular: false,
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await getSingleCategory(slug);
        const data = res.data.data.category;
        
        setCategoryId(data._id);
        setForm({
          nameEn: typeof data.name === "object" ? data.name.en : data.name || "",
          nameBn: typeof data.name === "object" ? data.name.bn : "",
          description: data.description || "",
          isPopular: data.isPopular || false,
        });
        setImagePreview(data.image?.url || "");
      } catch (error) {
        toast.error("Failed to fetch category details");
        navigate("/admin/categories");
      } finally {
        setFetching(false);
      }
    };
    fetchCategory();
  }, [slug, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      return toast.error("Image size must be less than 5MB");
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", JSON.stringify({ en: form.nameEn, bn: form.nameBn }));
    formData.append("description", form.description);
    formData.append("isPopular", form.isPopular);
    
    if (image) {
      formData.append("image", image);
    }

    try {
      setLoading(true);
      await updateCategory(categoryId, formData);
      toast.success("Category updated successfully!");
      navigate("/admin/categories"); // আপডেট হওয়ার পর লিস্টে ব্যাক করবে
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update category");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="text-center py-20 font-pop">Loading category details...</div>;

  return (
    <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm border border-brdr font-pop">
      <div className="mb-8 border-b border-brdr pb-5 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Edit Category</h2>
          <p className="text-sm text-gray-500 mt-1">Update details for this category.</p>
        </div>
        <button 
          onClick={() => navigate(-1)} 
          className="text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6 md:items-start">
            <div className="flex-1 space-y-4">
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Category Name (English) <span className="text-red-500">*</span></label>
                    <input
                        name="nameEn"
                        value={form.nameEn}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-brdr bg-white p-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                </div>
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Category Name (Bengali) <span className="text-red-500">*</span></label>
                    <input
                        name="nameBn"
                        value={form.nameBn}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-brdr bg-white p-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                </div>
            </div>
            
            <div className="md:mt-8 flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-brdr">
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" name="isPopular" checked={form.isPopular} onChange={handleChange} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
                <div>
                    <span className="text-sm font-semibold text-gray-800 block">Mark as Popular</span>
                    <span className="text-xs text-gray-500">Show on homepage</span>
                </div>
            </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="3"
            className="w-full rounded-xl border border-brdr bg-white p-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary resize-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Category Image</label>
          <label className="group relative flex h-48 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-brdr bg-gray-50/50 transition-all hover:border-primary hover:bg-primary/5">
            {imagePreview ? (
              <img src={imagePreview} alt="preview" className="h-full w-full object-contain p-2" />
            ) : (
              <div className="flex flex-col items-center text-primary">
                <UploadCloud className="mb-2 h-10 w-10 opacity-75" />
                <span className="text-sm font-semibold">Upload Image</span>
                <span className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</span>
              </div>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </label>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-xl py-3.5 text-base font-semibold text-white transition-all duration-300 cursor-pointer ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-primary shadow-md hover:shadow-lg hover:opacity-90 active:scale-[0.99]"
            }`}
          >
            {loading ? "Updating..." : "Update Category"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCategory;