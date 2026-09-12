import { useState } from "react";
import { toast } from "react-toastify";
import { UploadCloud, Image as ImageIcon } from "lucide-react";
import { createCategory } from "../../api/categoryApi";

const AddCategory = () => {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    nameEn: "", // <--- Updated
    nameBn: "", // <--- Updated
    description: "",
    isPopular: false,
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

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

    // 5MB Size Validation (Best Practice)
    if (file.size > 5 * 1024 * 1024) {
      return toast.error("Image size must be less than 5MB");
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    // <--- Updated to send name as JSON object for multi-language
    formData.append("name", JSON.stringify({ en: form.nameEn, bn: form.nameBn }));
    formData.append("description", form.description);
    formData.append("isPopular", form.isPopular);
    
    if (image) {
      formData.append("image", image);
    }

    try {
      setLoading(true);
      const res = await createCategory(formData);
      
      toast.success(res.data.message || "Category created successfully!");
      
      // Reset Form
      setForm({ nameEn: "", nameBn: "", description: "", isPopular: false }); // <--- Updated
      setImage(null);
      
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
        setImagePreview("");
      }
      e.target.reset();
      
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm border border-brdr font-pop">
      <div className="mb-8 border-b border-brdr pb-5">
        <h2 className="text-2xl font-bold text-gray-900">Add New Category</h2>
        <p className="text-sm text-gray-500 mt-1">Create a new product category for your store.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Name & Toggle Section */}
        <div className="flex flex-col md:flex-row gap-6 md:items-start">
            <div className="flex-1 space-y-4"> {/* <--- Updated: wrapper for 2 inputs */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Category Name (English) <span className="text-red-500">*</span></label>
                    <input
                        name="nameEn"
                        value={form.nameEn}
                        onChange={handleChange}
                        placeholder="e.g., Fresh Vegetables"
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
                        placeholder="উদাঃ তাজা শাকসবজি"
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

        {/* Description */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Short description about this category..."
            rows="3"
            className="w-full rounded-xl border border-brdr bg-white p-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary resize-none"
          />
        </div>

        {/* Image Upload */}
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

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-xl py-3.5 text-base font-semibold text-white transition-all duration-300 cursor-pointer ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-primary shadow-md hover:shadow-lg hover:opacity-90 active:scale-[0.99]"
            }`}
          >
            {loading ? "Saving Category..." : "Save Category"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCategory;