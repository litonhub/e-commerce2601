import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { Loader2, PackageSearch } from "lucide-react"; // প্রিমিয়াম স্টেটের জন্য আইকন

import ProductHeader from "../../components/admindashboard/ProductHeader";
import ProductTable from "../../components/admindashboard/ProductTable";
import ProductPagination from "../../components/admindashboard/ProductPagination";
import BulkActionBar from "../../components/admindashboard/BulkActionBar";
import useDebounce from "../../hooks/useDebounce";
import {
    getProducts,
    deleteProduct,
    bulkDeleteProducts,
    bulkRestoreProducts,
    bulkUpdateProductStatus,
} from "../../api/productApi";

const Products = () => {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [pagination, setPagination] = useState({});
    const [page, setPage] = useState(1);
    const [selectedProducts, setSelectedProducts] = useState([]);

    // Future Ready
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("latest");
    const debouncedSearch = useDebounce(search, 500);

    const fetchProducts = async () => {
        try {
            setLoading(true);

            const params = {
                page,
                limit: 10,
                sort,
            };

            if (debouncedSearch.trim()) {
                params.q = debouncedSearch.trim();
            }

            const res = await getProducts(params);

            setProducts(res.data.data?.products || []);
            setPagination(res.data.data?.pagination || {});
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to fetch products");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, sort]);

    useEffect(() => {
        fetchProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, debouncedSearch, sort]);

    const handleDelete = async (id) => {
        const ok = window.confirm("Are you sure you want to delete this product?");
        if (!ok) return;

        try {
            const res = await deleteProduct(id);
            toast.success(res.data.message);

            setSelectedProducts((prev) => prev.filter((item) => item !== id));
            fetchProducts();
        } catch (err) {
            toast.error(err.response?.data?.message || "Delete failed");
        }
    };

    const handleBulkDelete = async () => {
        if (!selectedProducts.length) {
            return toast.warning("Select products first.");
        }

        const ok = window.confirm(`Delete ${selectedProducts.length} selected products?`);
        if (!ok) return;

        try {
            const res = await bulkDeleteProducts({
                ids: selectedProducts,
            });

            toast.success(res.data.message);
            setSelectedProducts([]);
            fetchProducts();
        } catch (err) {
            toast.error(err.response?.data?.message || "Bulk delete failed.");
        }
    };

    const handleBulkActivate = async () => {
        if (!selectedProducts.length) {
            return toast.warning("Select products first.");
        }

        try {
            const res = await bulkUpdateProductStatus({
                ids: selectedProducts,
                status: { isActive: true },
            });

            toast.success(res.data.message);
            setSelectedProducts([]);
            fetchProducts();
        } catch (err) {
            toast.error(err.response?.data?.message || "Status update failed.");
        }
    };

    const handleBulkDeactivate = async () => {
        if (!selectedProducts.length) {
            return toast.warning("Select products first.");
        }

        try {
            const res = await bulkUpdateProductStatus({
                ids: selectedProducts,
                status: { isActive: false },
            });

            toast.success(res.data.message);
            setSelectedProducts([]);
            fetchProducts();
        } catch (err) {
            toast.error(err.response?.data?.message || "Status update failed.");
        }
    };

    return (
        <div className="space-y-6 font-pop">
            <ProductHeader
                totalProducts={pagination.totalProducts || 0}
                search={search}
                onSearchChange={setSearch}
                sort={sort}
                onSortChange={setSort}
                onRefresh={() => {
                    setSearch("");
                    setSort("latest");
                    setPage(1);
                    fetchProducts();
                }}
                onAddProduct={() => navigate("/admin-dashboard/products/add")}
                onBulkProduct={() => navigate("/admin-dashboard/products/bulk")}
                onRecycleBin={() => navigate("/admin-dashboard/products/recycle-bin")}
            />

            <BulkActionBar
                selectedCount={selectedProducts.length}
                onDelete={handleBulkDelete}
                onRestore={() => {}} // Future use (as per original code)
                onActivate={handleBulkActivate}
                onDeactivate={handleBulkDeactivate}
                onClear={() => setSelectedProducts([])}
            />

            {/* Main Product Table Card */}
            <div className="rounded-2xl border border-brdr bg-white p-6 shadow-sm md:p-8">
                
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 md:text-2xl">
                            Products List
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Manage your catalog, update status, and track inventory.
                        </p>
                    </div>
                    {/* Badge for total items (Premium UI detail) */}
                    {!loading && pagination.totalProducts > 0 && (
                        <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                            {pagination.totalProducts} Items
                        </span>
                    )}
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-primary">
                        <Loader2 className="mb-4 h-10 w-10 animate-spin" />
                        <p className="font-medium text-gray-500">Loading products...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <PackageSearch size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">
                            {search ? "No Products Found" : "Your Catalog is Empty"}
                        </h3>
                        <p className="mt-2 max-w-md text-sm text-gray-500">
                            {search
                                ? `We couldn't find any products matching "${search}". Try adjusting your filters.`
                                : "Get started by adding your first product to the inventory."}
                        </p>
                        {!search && (
                            <button
                                onClick={() => navigate("/admin-dashboard/products/add")}
                                className="mt-6 rounded-xl bg-primary px-6 py-2.5 font-medium text-white shadow-sm transition-all hover:bg-primary/90 active:scale-95"
                            >
                                Add New Product
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <ProductTable
                            products={products}
                            selectedProducts={selectedProducts}
                            setSelectedProducts={setSelectedProducts}
                            onEdit={(product) =>
                                navigate(`/admin-dashboard/products/edit/${product._id}`)
                            }
                            onDelete={(product) => handleDelete(product._id)}
                        />

                        <div className="mt-6 border-t border-brdr pt-6">
                            <ProductPagination
                                pagination={pagination}
                                page={page}
                                setPage={setPage}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Products;