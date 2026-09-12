import { useState } from "react";
import { Plus, Trash2, UploadCloud, Image as ImageIcon, X } from "lucide-react";
import { toast } from "react-toastify";
import { bulkCreateProducts } from "../../../api/productApi";

const emptyProduct = () => ({
    // --- Updated for Multi-language ---
    titleEn: "",
    titleBn: "",
    descriptionEn: "",
    descriptionBn: "",
    tagsEn: "",
    tagsBn: "",
    category: "",
    brand: "",
    price: "",
    stock: "",
    thumbnail: null,
    images: [],
    thumbnailPreview: "",
    galleryPreview: [],
});

const ManualBulkForm = () => {
    const [products, setProducts] = useState([emptyProduct()]);
    const [loading, setLoading] = useState(false);

    const handleChange = (index, field, value) => {
        setProducts((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const handleThumbnail = (index, file) => {
        if (!file) return;
        setProducts((prev) => {
            const updated = [...prev];
            if (updated[index].thumbnailPreview) {
                URL.revokeObjectURL(updated[index].thumbnailPreview);
            }
            updated[index] = {
                ...updated[index],
                thumbnail: file,
                thumbnailPreview: URL.createObjectURL(file),
            };
            return updated;
        });
    };

    const removeThumbnail = (index) => {
        setProducts((prev) => {
            const updated = [...prev];
            if (updated[index].thumbnailPreview) {
                URL.revokeObjectURL(updated[index].thumbnailPreview);
            }
            updated[index].thumbnail = null;
            updated[index].thumbnailPreview = "";
            return updated;
        });
    };

    const handleGallery = (index, files) => {
        if (!files.length) return;
        setProducts((prev) => {
            const updated = [...prev];
            updated[index].galleryPreview.forEach((url) => URL.revokeObjectURL(url));
            updated[index] = {
                ...updated[index],
                images: files,
                galleryPreview: files.map((file) => URL.createObjectURL(file)),
            };
            return updated;
        });
    };

    const clearGallery = (index) => {
        setProducts((prev) => {
            const updated = [...prev];
            updated[index].galleryPreview.forEach((url) => URL.revokeObjectURL(url));
            updated[index].images = [];
            updated[index].galleryPreview = [];
            return updated;
        });
    };

    const addProduct = () => {
        setProducts((prev) => [...prev, emptyProduct()]);
    };

    const removeProduct = (index) => {
        if (products.length === 1) {
            return toast.warning("At least one product is required.");
        }
        if (products[index].thumbnailPreview) URL.revokeObjectURL(products[index].thumbnailPreview);
        products[index].galleryPreview.forEach((url) => URL.revokeObjectURL(url));
        setProducts((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!products.length) {
            return toast.warning("Add at least one product.");
        }

        for (const [index, product] of products.entries()) {
            if (
                !product.titleEn.trim() ||
                !product.descriptionEn.trim() ||
                !product.category.trim() ||
                product.price === "" ||
                product.stock === ""
            ) {
                return toast.error(`Please complete required fields for Product #${index + 1}.`);
            }

            if (!product.thumbnail) {
                return toast.error(`Thumbnail is required for Product #${index + 1}.`);
            }
        }

        const formData = new FormData();

        products.forEach((product, index) => {
            // --- Updated for Multi-language Object ---
            formData.append(`products[${index}][title][en]`, product.titleEn.trim());
            formData.append(`products[${index}][title][bn]`, product.titleBn.trim());
            formData.append(`products[${index}][description][en]`, product.descriptionEn.trim());
            formData.append(`products[${index}][description][bn]`, product.descriptionBn.trim());
            formData.append(`products[${index}][tags][en]`, product.tagsEn.trim());
            formData.append(`products[${index}][tags][bn]`, product.tagsBn.trim());
            
            formData.append(`products[${index}][category]`, product.category.trim());
            formData.append(`products[${index}][brand]`, product.brand.trim());
            formData.append(`products[${index}][price]`, product.price);
            formData.append(`products[${index}][stock]`, product.stock);
            formData.append(`products[${index}][thumbnail]`, product.thumbnail);

            product.images.forEach((image) => {
                formData.append(`products[${index}][images]`, image);
            });
        });

        try {
            setLoading(true);
            const res = await bulkCreateProducts(formData);
            
            toast.success(res.data.message);

            if (res.data.data?.failedProducts?.length) {
                toast.warning(`${res.data.data.failedProducts.length} product(s) failed.`);
            }

            products.forEach(p => {
                if (p.thumbnailPreview) URL.revokeObjectURL(p.thumbnailPreview);
                p.galleryPreview.forEach(url => URL.revokeObjectURL(url));
            });

            setProducts([emptyProduct()]);
        } catch (err) {
            toast.error(err.response?.data?.message || "Bulk product creation failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 font-pop">
            
            <div className="space-y-6">
                {products.map((product, index) => (
                    <div
                        key={index}
                        className="rounded-2xl border border-brdr bg-white p-6 md:p-8 shadow-sm transition-all hover:shadow-md"
                    >
                        <div className="mb-6 flex items-center justify-between border-b border-brdr pb-4">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">
                                    Product #{index + 1}
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Fill in the required information below.
                                </p>
                            </div>

                            {products.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeProduct(index)}
                                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500 transition hover:bg-red-500 hover:text-white"
                                    title="Remove this product"
                                >
                                    <Trash2 size={18} />
                                </button>
                            )}
                        </div>

                        {/* Title Section (En & Bn) */}
                        <div className="grid gap-6 md:grid-cols-2 mb-6">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Product Title (English) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={product.titleEn}
                                    onChange={(e) => handleChange(index, "titleEn", e.target.value)}
                                    placeholder="Enter product title"
                                    className="w-full rounded-xl border border-brdr bg-white px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Product Title (Bangla)
                                </label>
                                <input
                                    type="text"
                                    value={product.titleBn}
                                    onChange={(e) => handleChange(index, "titleBn", e.target.value)}
                                    placeholder="পণ্যের নাম লিখুন"
                                    className="w-full rounded-xl border border-brdr bg-white px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                                />
                            </div>
                        </div>

                        {/* Brand & Category */}
                        <div className="grid gap-6 md:grid-cols-2 mb-6">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">Brand</label>
                                <input
                                    type="text"
                                    value={product.brand}
                                    onChange={(e) => handleChange(index, "brand", e.target.value)}
                                    placeholder="e.g., Zara"
                                    className="w-full rounded-xl border border-brdr bg-white px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={product.category}
                                    onChange={(e) => handleChange(index, "category", e.target.value)}
                                    placeholder="e.g., Clothing"
                                    className="w-full rounded-xl border border-brdr bg-white px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                                />
                            </div>
                        </div>

                        {/* Price & Stock */}
                        <div className="grid gap-6 md:grid-cols-2 mb-6">
                             <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Price <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={product.price}
                                    onChange={(e) => handleChange(index, "price", e.target.value)}
                                    placeholder="0.00"
                                    className="w-full rounded-xl border border-brdr bg-white px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Stock <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={product.stock}
                                    onChange={(e) => handleChange(index, "stock", e.target.value)}
                                    placeholder="0"
                                    className="w-full rounded-xl border border-brdr bg-white px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                                />
                            </div>
                        </div>

                        {/* Description (En & Bn) */}
                        <div className="grid gap-6 md:grid-cols-2 mb-6">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Description (English) <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    rows={4}
                                    value={product.descriptionEn}
                                    onChange={(e) => handleChange(index, "descriptionEn", e.target.value)}
                                    placeholder="Detailed product description..."
                                    className="w-full resize-none rounded-xl border border-brdr bg-white px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Description (Bangla)
                                </label>
                                <textarea
                                    rows={4}
                                    value={product.descriptionBn}
                                    onChange={(e) => handleChange(index, "descriptionBn", e.target.value)}
                                    placeholder="পণ্যের বিস্তারিত বিবরণ..."
                                    className="w-full resize-none rounded-xl border border-brdr bg-white px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                                />
                            </div>
                        </div>

                        {/* Tags (En & Bn) */}
                        <div className="grid gap-6 md:grid-cols-2 mb-6">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">Tags (English, comma separated)</label>
                                <input
                                    type="text"
                                    value={product.tagsEn}
                                    onChange={(e) => handleChange(index, "tagsEn", e.target.value)}
                                    placeholder="e.g. fresh, organic"
                                    className="w-full rounded-xl border border-brdr bg-white px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">Tags (Bangla, comma separated)</label>
                                <input
                                    type="text"
                                    value={product.tagsBn}
                                    onChange={(e) => handleChange(index, "tagsBn", e.target.value)}
                                    placeholder="যেমন: তাজা, অর্গানিক"
                                    className="w-full rounded-xl border border-brdr bg-white px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                                />
                            </div>
                        </div>

                        {/* Images Upload */}
                        <div className="grid gap-6 md:grid-cols-2 mb-6">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Thumbnail <span className="text-red-500">*</span>
                                </label>
                                {product.thumbnailPreview ? (
                                    <div className="group relative flex h-40 w-full items-center justify-center rounded-xl border border-brdr bg-gray-50 p-2 shadow-sm">
                                        <img
                                            src={product.thumbnailPreview}
                                            alt="Thumbnail"
                                            className="h-full w-full rounded-lg object-contain"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeThumbnail(index)}
                                            className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition-transform hover:scale-110"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-brdr bg-primary/5 transition-all hover:border-primary hover:bg-primary/10">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-primary">
                                            <ImageIcon className="mb-3 h-10 w-10 opacity-75" />
                                            <p className="text-sm font-semibold">Click to upload</p>
                                            <p className="mt-1 text-xs text-gray-500">JPG, PNG (1 file)</p>
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => handleThumbnail(index, e.target.files[0])}
                                        />
                                    </label>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 flex items-center justify-between text-sm font-medium text-gray-700">
                                    <span>Gallery Images</span>
                                    {product.galleryPreview.length > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => clearGallery(index)}
                                            className="text-xs text-red-500 hover:underline"
                                        >
                                            Clear All
                                        </button>
                                    )}
                                </label>
                                <label className="flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-brdr bg-primary/5 transition-all hover:border-primary hover:bg-primary/10">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-primary">
                                        <UploadCloud className="mb-3 h-10 w-10 opacity-75" />
                                        <p className="text-sm font-semibold">Upload Gallery</p>
                                        <p className="mt-1 text-xs text-gray-500">Select multiple</p>
                                    </div>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleGallery(index, Array.from(e.target.files))}
                                    />
                                </label>
                            </div>
                        </div>

                        {product.galleryPreview.length > 0 && (
                            <div className="mt-6 rounded-xl border border-brdr bg-gray-50 p-4">
                                <span className="mb-3 block text-sm font-semibold text-gray-700">
                                    Selected Gallery Images ({product.galleryPreview.length})
                                </span>
                                <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8">
                                    {product.galleryPreview.map((image, imgIndex) => (
                                        <div key={imgIndex} className="aspect-square rounded-xl border bg-white p-1 shadow-sm">
                                            <img
                                                src={image}
                                                alt="Gallery"
                                                className="h-full w-full rounded-lg object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="flex flex-col-reverse items-center justify-between gap-4 border-t border-brdr pt-6 sm:flex-row">
                <button
                    type="button"
                    onClick={addProduct}
                    className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-primary bg-primary/5 px-6 py-3.5 font-semibold text-primary transition hover:bg-primary hover:text-white"
                >
                    <Plus size={18} />
                    Add Another Product
                </button>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto rounded-xl bg-green-600 px-8 py-3.5 font-semibold text-white shadow-md transition hover:bg-green-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? "Creating Products..." : "Submit All Products"}
                </button>
            </div>
        </form>
    );
};

export default ManualBulkForm;