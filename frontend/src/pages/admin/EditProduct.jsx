import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { Loader2, UploadCloud, Image as ImageIcon, Edit2 } from "lucide-react";

import { getProductById, updateProduct } from "../../api/productApi";
import Container from "../../components/layouts/Container";

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const [form, setForm] = useState({
        titleEn: "",
        titleBn: "",
        category: "",
        descriptionEn: "",
        descriptionBn: "",
        tagsEn: "",
        tagsBn: "",
        price: "",
        discountPercentage: "", // <--- [NEW] Added discount field
        stock: "",
        sku: "",
        weight: "",
        brand: "",
        rating: 5,
        popular: false,
        featured: false,
        bestSeller: false,
        latest: false,
        hotDeals: false,
    });

    const [thumbnail, setThumbnail] = useState(null);
    const [images, setImages] = useState([]);
    const [thumbnailPreview, setThumbnailPreview] = useState("");
    const [galleryPreview, setGalleryPreview] = useState([]);

    useEffect(() => {
        fetchProduct();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const res = await getProductById(id);
            const product = res.data.data;

            setForm({
                titleEn: typeof product.title === "object" ? product.title?.en || "" : product.title || "",
                titleBn: typeof product.title === "object" ? product.title?.bn || "" : "",
                category: product.category || "",
                descriptionEn: typeof product.description === "object" ? product.description?.en || "" : product.description || "",
                descriptionBn: typeof product.description === "object" ? product.description?.bn || "" : "",
                tagsEn: typeof product.tags === "object" && Array.isArray(product.tags?.en) ? product.tags.en.join(", ") : Array.isArray(product.tags) ? product.tags.join(", ") : "",
                tagsBn: typeof product.tags === "object" && Array.isArray(product.tags?.bn) ? product.tags.bn.join(", ") : "",
                price: product.price ?? "",
                discountPercentage: product.discountPercentage ?? "", // <--- [NEW] Fetch discount data
                stock: product.stock ?? "",
                sku: product.sku || "",
                weight: product.weight || "",
                brand: product.brand || "",
                rating: product.rating || 5,
                popular: product.popular || false,
                featured: product.featured || false,
                bestSeller: product.bestSeller || false,
                latest: product.latest || false,
                hotDeals: product.hotDeals || false,
            });

            setThumbnailPreview(product.thumbnail?.url || "");
            setGalleryPreview(product.images || []);
            setThumbnail(null);
            setImages([]);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to load product.");
        } finally {
            setLoading(false);
        }
    };

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

        const formData = new FormData();

        formData.append("title[en]", form.titleEn);
        formData.append("title[bn]", form.titleBn);
        formData.append("description[en]", form.descriptionEn);
        formData.append("description[bn]", form.descriptionBn);
        formData.append("tags[en]", form.tagsEn);
        formData.append("tags[bn]", form.tagsBn);

        // <--- [UPDATED] Added discountPercentage to otherFields
        const otherFields = [
            "category", "price", "discountPercentage", "stock", "sku", "weight", "brand", 
            "rating", "popular", "featured", "bestSeller", "latest", "hotDeals"
        ];

        otherFields.forEach((key) => {
            formData.append(key, form[key]);
        });

        if (thumbnail) {
            formData.append("thumbnail", thumbnail);
        }

        images.forEach((img) => {
            formData.append("images", img);
        });

        try {
            setUpdating(true);
            const res = await updateProduct(id, formData);
            toast.success(res.data.message || "Product updated successfully!");

            navigate("/admin-dashboard/products", {
                replace: true,
            });
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update.");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <Container>
                <div className="flex min-h-[60vh] flex-col items-center justify-center text-primary">
                    <Loader2 className="mb-4 h-10 w-10 animate-spin" />
                    <p className="font-medium text-gray-500">Loading Product Details...</p>
                </div>
            </Container>
        );
    }

    return (
        <Container>
            <div className="mx-auto max-w-4xl rounded-2xl border border-brdr bg-white p-6 font-pop shadow-sm md:p-8">
                
                <div className="mb-8 border-b border-brdr pb-5">
                    <h2 className="text-2xl font-bold text-gray-900">Edit Product</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Update your product information, pricing, and images below.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* TITLE FIELDS */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Product Title (English) *</label>
                            <input
                                type="text"
                                name="titleEn"
                                value={form.titleEn}
                                onChange={handleChange}
                                required
                                className="w-full rounded-xl border border-brdr px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Product Title (Bangla)</label>
                            <input
                                type="text"
                                name="titleBn"
                                value={form.titleBn}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-brdr px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                        </div>
                    </div>

                    {/* CATEGORY & BRAND */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Category *</label>
                            <input
                                type="text"
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                required
                                className="w-full rounded-xl border border-brdr px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Brand</label>
                            <input
                                type="text"
                                name="brand"
                                value={form.brand}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-brdr px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                        </div>
                    </div>

                    {/* DESCRIPTIONS */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Description (English) *</label>
                            <textarea
                                rows={5}
                                name="descriptionEn"
                                value={form.descriptionEn}
                                onChange={handleChange}
                                required
                                className="w-full resize-none rounded-xl border border-brdr px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Description (Bangla)</label>
                            <textarea
                                rows={5}
                                name="descriptionBn"
                                value={form.descriptionBn}
                                onChange={handleChange}
                                className="w-full resize-none rounded-xl border border-brdr px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                        </div>
                    </div>

                    {/* TAGS */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Tags (English, comma separated)</label>
                            <input
                                type="text"
                                name="tagsEn"
                                value={form.tagsEn}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-brdr px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Tags (Bangla, comma separated)</label>
                            <input
                                type="text"
                                name="tagsBn"
                                value={form.tagsBn}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-brdr px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                        </div>
                    </div>

                    {/* PRICE, DISCOUNT, STOCK, SKU, WEIGHT */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Price *</label>
                            <input
                                type="number"
                                name="price"
                                min="0"
                                step="0.01"
                                value={form.price}
                                onChange={handleChange}
                                required
                                className="w-full rounded-xl border border-brdr px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                        </div>

                        {/* --- [NEW] Discount Input Field --- */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Discount (%)</label>
                            <input
                                type="number"
                                name="discountPercentage"
                                min="0"
                                max="100"
                                value={form.discountPercentage}
                                onChange={handleChange}
                                placeholder="e.g. 15"
                                className="w-full rounded-xl border border-brdr px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Stock *</label>
                            <input
                                type="number"
                                name="stock"
                                min="0"
                                step="1"
                                value={form.stock}
                                onChange={handleChange}
                                required
                                className="w-full rounded-xl border border-brdr px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">SKU</label>
                            <input
                                type="text"
                                name="sku"
                                value={form.sku}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-brdr px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Weight</label>
                            <input
                                type="text"
                                name="weight"
                                placeholder="e.g. 500g"
                                value={form.weight}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-brdr px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Rating (1-5)</label>
                        <input
                            type="number"
                            name="rating"
                            min="1"
                            max="5"
                            step="0.1"
                            value={form.rating}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-brdr px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                        <ToggleField label="Popular" name="popular" />
                        <ToggleField label="Featured" name="featured" />
                        <ToggleField label="Best Seller" name="bestSeller" />
                        <ToggleField label="Latest" name="latest" />
                        <ToggleField label="Hot Deals" name="hotDeals" />
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 pt-4">
                        <div>
                            <label className="group relative flex h-36 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-brdr transition-all hover:border-primary">
                                {thumbnailPreview ? (
                                    <>
                                        <img src={thumbnailPreview} alt="thumbnail" className="h-full w-full object-contain p-2" />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                                            <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-md">
                                                <Edit2 size={16} /> Change Image
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center text-gray-500">
                                        <UploadCloud className="mb-2 h-8 w-8" />
                                        <span className="text-sm font-medium">Upload Thumbnail</span>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (!file) return;
                                        setThumbnail(file);
                                        setThumbnailPreview(URL.createObjectURL(file));
                                    }}
                                />
                            </label>
                        </div>

                        <div>
                            <label className="flex h-36 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-brdr transition-all hover:border-primary">
                                <div className="flex flex-col items-center text-gray-500">
                                    <ImageIcon className="mb-2 h-8 w-8" />
                                    <span className="text-sm font-medium">Upload Gallery</span>
                                </div>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const files = Array.from(e.target.files);
                                        if (files.length > 10) {
                                            toast.error("Maximum 10 images allowed");
                                            return;
                                        }
                                        setImages(files);
                                        setGalleryPreview(
                                            files.map((file) => ({
                                                url: URL.createObjectURL(file),
                                                public_id: file.name,
                                            }))
                                        );
                                    }}
                                />
                            </label>
                        </div>
                    </div>

                    {galleryPreview.length > 0 && (
                        <div className="rounded-xl border border-brdr bg-gray-50 p-5 shadow-sm">
                            <h4 className="mb-3 text-sm font-semibold text-gray-700">
                                Gallery Preview ({galleryPreview.length})
                            </h4>
                            <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8">
                                {galleryPreview.map((img, index) => (
                                    <div key={img.public_id || index} className="aspect-square rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
                                        <img
                                            src={img.url}
                                            alt="gallery"
                                            className="h-full w-full rounded-lg object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={updating}
                            className="w-full rounded-xl bg-primary py-3.5 text-base font-semibold text-white shadow-md transition-all hover:opacity-90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {updating ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Updating Product...
                                </span>
                            ) : (
                                "Update Product"
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </Container>
    );
};

export default EditProduct;