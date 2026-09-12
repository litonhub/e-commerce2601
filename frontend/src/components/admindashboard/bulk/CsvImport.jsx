import { useRef, useState } from "react";
import { UploadCloud, Download, FileText, X } from "lucide-react";
import { toast } from "react-toastify";

import {
    importProductsFromCsv,
    downloadCsvTemplate,
    downloadFailedImportReport,
} from "../../../api/productApi";

const CsvImport = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const fileInputRef = useRef(null);

    const handleSelectFile = (e) => {
        const selected = e.target.files[0];
        if (!selected) return;

        if (!selected.name.endsWith(".csv")) {
            toast.error("Please select a CSV file.");
            return;
        }

        setFile(selected);
    };

    const handleRemoveFile = (e) => {
        e.preventDefault();
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleTemplateDownload = async () => {
        try {
            const res = await downloadCsvTemplate();
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            
            link.href = url;
            link.download = "products-template.csv";
            link.click();
            
            window.URL.revokeObjectURL(url);
        } catch {
            toast.error("Template download failed.");
        }
    };

    const handleImport = async () => {
        if (!file) {
            return toast.warning("Please select a CSV file.");
        }

        try {
            setResult(null);
            setLoading(true);

            const formData = new FormData();
            formData.append("file", file);

            const res = await importProductsFromCsv(formData);

            setResult(res.data.data);
            toast.success(res.data.message);

            setFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "CSV import failed.");
        } finally {
            setLoading(false);
        }
    };

    const handleFailedReport = async () => {
        if (!result?.failedProducts?.length) return;

        try {
            const res = await downloadFailedImportReport({
                failedProducts: result.failedProducts,
            });

            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            
            link.href = url;
            link.download = "failed-products.csv";
            link.click();
            
            window.URL.revokeObjectURL(url);
        } catch {
            toast.error("Failed report download failed.");
        }
    };

    return (
        <div className="space-y-6 font-pop">
            <div className="rounded-2xl border border-brdr bg-white p-8 shadow-sm">
                
                {/* Header Actions */}
                <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Import from CSV</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Upload your .csv file to bulk import products.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleTemplateDownload}
                        className="flex items-center gap-2 rounded-xl border border-primary px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
                    >
                        <Download size={16} />
                        Download Template
                    </button>
                </div>

                {/* PREMIUM FILE UPLOAD BOX */}
                <div className="mx-auto max-w-2xl">
                    {!file ? (
                        <label className="flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-brdr bg-primary/5 transition-all hover:border-primary hover:bg-primary/10">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-primary">
                                <FileText className="mb-3 h-12 w-12 opacity-80" />
                                <p className="text-base font-semibold">Click to upload CSV File</p>
                                <p className="mt-1 text-sm text-gray-500">.csv only</p>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".csv"
                                className="hidden"
                                onChange={handleSelectFile}
                            />
                        </label>
                    ) : (
                        <div className="relative flex h-48 w-full flex-col items-center justify-center rounded-xl border-2 border-solid border-primary/30 bg-primary/5 p-6">
                            <FileText className="mb-3 h-12 w-12 text-primary" />
                            <p className="line-clamp-1 text-center font-semibold text-gray-800">
                                {file.name}
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                                {(file.size / 1024).toFixed(2)} KB
                            </p>
                            
                            <button
                                onClick={handleRemoveFile}
                                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600 transition hover:bg-red-500 hover:text-white"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    )}

                    <div className="mt-6 flex justify-center">
                        <button
                            type="button"
                            onClick={handleImport}
                            disabled={loading || !file}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-base font-semibold text-white shadow-md transition-all hover:opacity-90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <UploadCloud size={18} />
                            {loading ? "Importing Data..." : "Import CSV"}
                        </button>
                    </div>
                </div>
            </div>

            {/* IMPORT SUMMARY SECTION */}
            {result && (
                <div className="rounded-2xl border border-green-200 bg-green-50 p-6">
                    <h3 className="mb-2 text-xl font-bold text-green-800">Import Summary</h3>
                    <p className="mb-6 text-sm text-green-700/80">
                        Successfully imported products and failed products are listed below.
                    </p>

                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-xl border border-green-100 bg-white p-5 shadow-sm">
                            <p className="text-sm font-medium text-gray-500">Imported</p>
                            <h4 className="mt-1 text-3xl font-bold text-green-600">{result.created ?? 0}</h4>
                        </div>
                        <div className="rounded-xl border border-red-100 bg-white p-5 shadow-sm">
                            <p className="text-sm font-medium text-gray-500">Failed</p>
                            <h4 className="mt-1 text-3xl font-bold text-red-600">{result.failed ?? 0}</h4>
                        </div>
                        <div className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm">
                            <p className="text-sm font-medium text-gray-500">Total Rows</p>
                            <h4 className="mt-1 text-3xl font-bold text-primary">{result.total ?? 0}</h4>
                        </div>
                    </div>

                    {result.createdProducts?.length > 0 && (
                        <div className="mt-6">
                            <h4 className="mb-3 font-semibold text-green-700">Created Products</h4>
                            <div className="space-y-2 rounded-xl bg-white p-4 shadow-sm">
                                {result.createdProducts.map((item) => (
                                    <div key={item._id} className="flex justify-between border-b py-2 last:border-none">
                                        <span className="font-medium text-gray-700">{item.title}</span>
                                        <span className="text-sm font-medium text-green-600">Created</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {result.failedProducts?.length > 0 && (
                        <div className="mt-6">
                            <h4 className="mb-3 font-semibold text-red-600">Failed Products</h4>
                            <div className="space-y-2 rounded-xl bg-white p-4 shadow-sm">
                                {result.failedProducts.map((item, index) => (
                                    <div key={index} className="border-b py-2 last:border-none">
                                        <div className="font-medium text-gray-700">{item.title || "Untitled"}</div>
                                        <div className="mt-1 text-sm text-red-500">{item.reason}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {result.failedProducts?.length > 0 && (
                        <div className="mt-6 flex justify-end">
                            <button
                                type="button"
                                onClick={handleFailedReport}
                                className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
                            >
                                <Download size={16} />
                                Download Failed Report
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CsvImport;