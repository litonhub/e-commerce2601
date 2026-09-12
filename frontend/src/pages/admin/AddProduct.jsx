import { useState } from "react";
import { toast } from "react-toastify";
import { UploadCloud, Image as ImageIcon } from "lucide-react";
import { createProduct } from "../../api/productApi";

const AddProduct = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    titleEn: "",
    titleBn: "",
    descriptionEn: "",
    descriptionBn: "",
    tagsEn: "",
    tagsBn: "",
    price: "",
    discountPercentage: "", // <--- [NEW] Added discount field
    category: "",
    brand: "",
    stock: "",
    sku: "",
    weight: "",
    rating: 5,
    popular: false,
    featured: false,
    bestSeller: false,
    latest: false,
    hotDeals: false,
  });

  const [thumbnail, setThumbnail] = useState(null);
  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : name === "rating" ? Number(value) : value,
    });
  };

  const ToggleField = ({ label, name }) => (
    <div className="flex items-center justify-between p-3 border border-brdr rounded-xl bg-gray-50/50">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          name={name}
          checked={form[name]}
          onChange={handleChange}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-primary transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
      </label>
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!thumbnail) return toast.error("Thumbnail required");

    const formData = new FormData();
    
    // Multi-language Object append
    formData.append("title[en]", form.titleEn);
    formData.append("title[bn]", form.titleBn);
    formData.append("description[en]", form.descriptionEn);
    formData.append("description[bn]", form.descriptionBn);
    formData.append("tags[en]", form.tagsEn);
    formData.append("tags[bn]", form.tagsBn);

    // Other Fields append
    const otherFields = [
      "price", "discountPercentage", "category", "brand", "stock", "sku", "weight",  // <--- [UPDATED] Included discountPercentage
      "rating", "popular", "featured", "bestSeller", "latest", "hotDeals"
    ];

    otherFields.forEach((key) => {
      // Allow empty string for discount to default to 0 in backend
      formData.append(key, form[key]);
    });

    formData.append("thumbnail", thumbnail);
    images.forEach((img) => formData.append("images", img));

    try {
      setLoading(true);
      await createProduct(formData);
      toast.success("Product created successfully!");
      setForm({
        titleEn: "", titleBn: "", descriptionEn: "", descriptionBn: "", tagsEn: "", tagsBn: "",
        price: "", discountPercentage: "", category: "", brand: "", stock: "", sku: "", weight: "", rating: 5, 
        popular: false, featured: false, bestSeller: false, latest: false, hotDeals: false,
      });
      setThumbnail(null);
      setImages([]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-sm border border-brdr font-pop">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Add New Product</h2>
        <p className="text-sm text-gray-500 mt-1">Fill in the details below to add a new product.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Fields */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Product Title (English) *</label>
            <input name="titleEn" value={form.titleEn} onChange={handleChange} required className="w-full rounded-xl border border-brdr p-3 text-sm focus:border-primary outline-none" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Product Title (Bangla)</label>
            <input name="titleBn" value={form.titleBn} onChange={handleChange} className="w-full rounded-xl border border-brdr p-3 text-sm focus:border-primary outline-none" />
          </div>
        </div>

        {/* Category & Brand */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Category *</label>
            <input name="category" value={form.category} onChange={handleChange} required className="w-full rounded-xl border border-brdr p-3 text-sm focus:border-primary outline-none" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Brand</label>
            <input name="brand" value={form.brand} onChange={handleChange} className="w-full rounded-xl border border-brdr p-3 text-sm focus:border-primary outline-none" />
          </div>
        </div>

        {/* Descriptions */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Description (English) *</label>
            <textarea name="descriptionEn" value={form.descriptionEn} onChange={handleChange} required rows="4" className="w-full rounded-xl border border-brdr p-3 text-sm focus:border-primary outline-none" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Description (Bangla)</label>
            <textarea name="descriptionBn" value={form.descriptionBn} onChange={handleChange} rows="4" className="w-full rounded-xl border border-brdr p-3 text-sm focus:border-primary outline-none" />
          </div>
        </div>

        {/* Tags */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Tags (English, comma separated)</label>
            <input name="tagsEn" value={form.tagsEn} onChange={handleChange} placeholder="e.g. bundle, seasonal, organic" className="w-full rounded-xl border border-brdr p-3 text-sm focus:border-primary outline-none" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Tags (Bangla, comma separated)</label>
            <input name="tagsBn" value={form.tagsBn} onChange={handleChange} placeholder="যেমন: তাজা, অর্গানিক" className="w-full rounded-xl border border-brdr p-3 text-sm focus:border-primary outline-none" />
          </div>
        </div>

        {/* Price, Discount, Stock, SKU, Weight */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Price *</label>
            <input type="number" name="price" value={form.price} onChange={handleChange} required className="w-full rounded-xl border border-brdr p-3 text-sm focus:border-primary outline-none" />
          </div>
          
          {/* --- [NEW] Discount Percentage Input --- */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Discount (%)</label>
            <input type="number" name="discountPercentage" min="0" max="100" value={form.discountPercentage} onChange={handleChange} placeholder="e.g. 15" className="w-full rounded-xl border border-brdr p-3 text-sm focus:border-primary outline-none" />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Stock *</label>
            <input type="number" name="stock" value={form.stock} onChange={handleChange} required className="w-full rounded-xl border border-brdr p-3 text-sm focus:border-primary outline-none" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">SKU</label>
            <input name="sku" value={form.sku} onChange={handleChange} className="w-full rounded-xl border border-brdr p-3 text-sm focus:border-primary outline-none" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Weight</label>
            <input name="weight" value={form.weight} onChange={handleChange} placeholder="e.g. 500g" className="w-full rounded-xl border border-brdr p-3 text-sm focus:border-primary outline-none" />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Rating (1-5)</label>
          <input type="number" name="rating" min="1" max="5" step="0.1" value={form.rating} onChange={handleChange} className="w-full rounded-xl border border-brdr p-3 text-sm focus:border-primary outline-none" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <ToggleField label="Popular" name="popular" />
          <ToggleField label="Featured" name="featured" />
          <ToggleField label="Best Seller" name="bestSeller" />
          <ToggleField label="Latest" name="latest" />
          <ToggleField label="Hot Deals" name="hotDeals" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <label className="flex flex-col items-center justify-center w-full h-36 rounded-xl border-2 border-dashed border-brdr cursor-pointer hover:border-primary">
            <UploadCloud className="w-8 h-8 text-gray-400" />
            <span className="text-sm mt-2">{thumbnail ? thumbnail.name : "Upload Thumbnail"}</span>
            <input type="file" className="hidden" onChange={(e) => setThumbnail(e.target.files[0])} />
          </label>
          <label className="flex flex-col items-center justify-center w-full h-36 rounded-xl border-2 border-dashed border-brdr cursor-pointer hover:border-primary">
            <ImageIcon className="w-8 h-8 text-gray-400" />
            <span className="text-sm mt-2">{images.length > 0 ? `${images.length} images` : "Upload Gallery"}</span>
            <input type="file" multiple className="hidden" onChange={(e) => setImages(Array.from(e.target.files))} />
          </label>
        </div>

        <button type="submit" disabled={loading} className="w-full rounded-xl py-3 bg-primary text-white font-semibold hover:opacity-90 disabled:bg-gray-400 cursor-pointer">
          {loading ? "Creating..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;