import { useEffect, useRef, useState } from "react";
import { UploadCloud, X, Download, Copy, ExternalLink, Image as ImageIcon } from "lucide-react";
import { toast } from "react-toastify";

import { bulkUploadImages, downloadUploadedImageLinks } from "../../../api/productApi";

const BulkImageUpload = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [uploadedImages, setUploadedImages] = useState([]);

    const fileInputRef = useRef(null);

    const handleSelectFiles = (e) => {
        const selectedFiles = Array.from(e.target.files);

        if (images.length + selectedFiles.length > 500) {
            return toast.error("Maximum 500 images allowed.");
        }

        if (selectedFiles.length === 0) return;

        // শুধু ইমেজ ফাইল ফিল্টার করা
        const validFiles = selectedFiles.filter((file) =>
            ["image/png", "image/jpeg", "image/webp"].includes(file.type)
        );

        if (validFiles.length !== selectedFiles.length) {
            toast.warning("Some files were skipped. Please select only images (PNG, JPG, WEBP).");
        }

        const newImages = validFiles.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));

        setImages((prev) => {
            const existing = new Set(
                prev.map((item) => `${item.file.name}-${item.file.size}`)
            );

            const filtered = newImages.filter(
                (item) => !existing.has(`${item.file.name}-${item.file.size}`)
            );
            return [...prev, ...filtered];
        });
    };

    const removeImage = (indexToRemove) => {
        setImages((prev) => {
            const updated = prev.filter((_, index) => index !== indexToRemove);
            URL.revokeObjectURL(prev[indexToRemove].preview);
            return updated;
        });
    };

    const handleUpload = async () => {
        if (images.length === 0) {
            return toast.warning("Please select at least one image.");
        }

        try {
            setUploadedImages([]);
            setLoading(true);

            const formData = new FormData();

            images.forEach((img) => formData.append("images", img.file));

            const res = await bulkUploadImages(formData);

            setUploadedImages(res.data.data.images || []);
            toast.success(`${res.data.data.total} images uploaded successfully.`);

            images.forEach((item) => URL.revokeObjectURL(item.preview));
            setImages([]);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Image upload failed.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        return () => {
            images.forEach((img) => URL.revokeObjectURL(img.preview));
        };
    }, [images]);

    const handleDownloadLinks = async () => {
        try {
            setDownloading(true);
            const res = await downloadUploadedImageLinks();
            
            const blob = new Blob([res.data], { type: "text/csv" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            
            link.href = url;
            link.download = "uploaded-image-links.csv";
            document.body.appendChild(link);
            link.click();
            link.remove();
            
            window.URL.revokeObjectURL(url);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to download image links.");
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="space-y-6 font-pop">
            <div className="rounded-2xl border border-brdr bg-white p-8 shadow-sm">
                
                {/* Header Actions */}
                <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Bulk Image Upload</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Upload multiple images (PNG, JPG, WEBP) for your products (Max 500).
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleDownloadLinks}
                        disabled={downloading}
                        className="flex items-center gap-2 rounded-xl border border-primary px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Download size={16} />
                        {downloading ? "Downloading..." : "Download Links CSV"}
                    </button>
                </div>

                {/* PREMIUM FILE UPLOAD BOX */}
                <div className="mx-auto w-full">
                    <label className="flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-brdr bg-primary/5 transition-all hover:border-primary hover:bg-primary/10">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-primary">
                            <ImageIcon className="mb-3 h-12 w-12 opacity-80" />
                            <p className="text-base font-semibold">Click to select Images</p>
                            <p className="mt-1 text-sm text-gray-500">You can select multiple files</p>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/png, image/jpeg, image/webp"
                            multiple
                            className="hidden"
                            onChange={handleSelectFiles}
                        />
                    </label>

                    {/* SELECTED IMAGES PREVIEW */}
                    {images.length > 0 && (
                        <div className="mt-6 w-full rounded-xl border border-brdr bg-gray-50 p-5 shadow-sm">
                            <div className="mb-4 flex items-center justify-between">
                                <span className="font-semibold text-gray-700">
                                    Selected Images ({images.length})
                                </span>
                                <button
                                    onClick={() => {
                                        images.forEach((img) => URL.revokeObjectURL(img.preview));
                                        setImages([]);
                                        if (fileInputRef.current) fileInputRef.current.value = "";
                                    }}
                                    className="text-sm font-medium text-red-500 hover:underline"
                                >
                                    Clear All
                                </button>
                            </div>

                            <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
                                {images.map((img, index) => (
                                    <div
                                        key={index}
                                        className="group relative aspect-square rounded-xl border border-gray-200 bg-white p-1.5 shadow-sm"
                                    >
                                        <img
                                            src={img.preview}
                                            alt="preview"
                                            className="h-full w-full rounded-lg object-cover"
                                        />
                                        <button
                                            onClick={() => removeImage(index)}
                                            className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 shadow-md transition-all group-hover:opacity-100 hover:scale-110"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-8 flex justify-center">
                        <button
                            type="button"
                            onClick={handleUpload}
                            disabled={loading || images.length === 0 || images.length > 500}
                            className="flex w-full md:w-auto items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-base font-semibold text-white shadow-md transition-all hover:opacity-90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <UploadCloud size={18} />
                            {loading
                                ? "Uploading..."
                                : `Upload ${images.length > 0 ? images.length : ""} Images`}
                        </button>
                    </div>
                </div>
            </div>

            {/* UPLOADED IMAGES RESULT (Premium Grid View) */}
            {uploadedImages.length > 0 && (
                <div className="rounded-2xl border border-green-200 bg-green-50 p-6">
                    <h4 className="mb-6 text-xl font-bold text-green-800">
                        Successfully Uploaded ({uploadedImages.length})
                    </h4>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {uploadedImages.map((item) => (
                            <div
                                key={item.public_id}
                                className="flex flex-col gap-3 rounded-xl border border-green-100 bg-white p-4 shadow-sm transition hover:shadow-md"
                            >
                                <div className="aspect-video w-full overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                                    <img
                                        src={item.url}
                                        alt={item.filename}
                                        className="h-full w-full object-contain"
                                    />
                                </div>
                                
                                <div className="flex flex-col">
                                    <p className="line-clamp-1 text-sm font-semibold text-gray-800" title={item.filename}>
                                        {item.filename}
                                    </p>
                                    <p className="mt-0.5 line-clamp-1 text-xs text-gray-500" title={item.public_id}>
                                        {item.public_id}
                                    </p>
                                </div>

                                <div className="mt-auto flex items-center gap-2 pt-2 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            navigator.clipboard.writeText(item.url);
                                            toast.success("Image URL copied!");
                                        }}
                                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-gray-50 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-primary/10 hover:text-primary"
                                    >
                                        <Copy size={14} />
                                        Copy Link
                                    </button>

                                    <a
                                        href={item.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center justify-center rounded-lg bg-gray-50 p-1.5 text-gray-600 transition hover:bg-primary/10 hover:text-primary"
                                        title="View full image"
                                    >
                                        <ExternalLink size={16} />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BulkImageUpload;