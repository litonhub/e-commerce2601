import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { RotateCcw, Trash2, PackageX } from "lucide-react";

import {
  getRecycleBinProducts,
  restoreProduct,
  permanentDeleteProduct,
  bulkRestoreProducts,
  bulkPermanentDeleteProducts,
} from "../../api/productApi";

import ProductPagination from "../../components/admindashboard/ProductPagination";
import BulkActionBar from "../../components/admindashboard/BulkActionBar";

const RecycleBinProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getRecycleBinProducts({
        page,
        limit: 10,
      });

      setProducts(res.data.data.products || []);
      setPagination(res.data.data.pagination || {});
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch recycle bin.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const handleRestore = async (id) => {
    try {
      const res = await restoreProduct(id);
      toast.success(res.data.message);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Restore failed.");
    }
  };
  
  const handleDelete = async (id) => {
    const ok = window.confirm("Permanently delete this product?");
    if (!ok) return;

    try {
      const res = await permanentDeleteProduct(id);
      toast.success(res.data.message);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed.");
    }
  };

  const handleBulkRestore = async () => {
    if (!selectedProducts.length) {
      return toast.warning("Select products first.");
    }

    try {
      const res = await bulkRestoreProducts({
        ids: selectedProducts,
      });

      toast.success(res.data.message);
      setSelectedProducts([]);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Restore failed.");
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedProducts.length) {
      return toast.warning("Select products first.");
    }

    const ok = window.confirm(`Permanently delete ${selectedProducts.length} products?`);
    if (!ok) return;

    try {
      const res = await bulkPermanentDeleteProducts({
        ids: selectedProducts,
      });

      toast.success(res.data.message);
      setSelectedProducts([]);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Recycle Bin</h2>
          <p className="mt-1 text-sm text-gray-500">
            Restore or permanently delete removed products.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-red-50 px-4 py-2 font-semibold text-red-600">
            Total : {pagination.totalProducts || 0}
          </div>
        </div>
      </div>

      <BulkActionBar
        selectedCount={selectedProducts.length}
        onDelete={handleBulkDelete}
        onRestore={handleBulkRestore}
        onActivate={() => {}}
        onDeactivate={() => {}}
        onClear={() => setSelectedProducts([])}
      />

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <PackageX size={70} className="text-gray-300" />
          <h3 className="mt-5 text-xl font-semibold text-gray-800">
            Recycle Bin is Empty
          </h3>
          <p className="mt-2 text-gray-500">There are no deleted products.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="min-w-full">
              <thead>
                <tr className="sticky top-0 z-10 border-b bg-gray-50">
                  <th className="w-14 px-4 py-4">
                    <input
                      type="checkbox"
                      checked={
                        products.length > 0 &&
                        selectedProducts.length === products.length
                      }
                      ref={(el) => {
                        if (el) {
                          el.indeterminate =
                            selectedProducts.length > 0 &&
                            selectedProducts.length < products.length;
                        }
                      }}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedProducts(products.map((item) => item._id));
                        } else {
                          setSelectedProducts([]);
                        }
                      }}
                      className="h-4 w-4 cursor-pointer rounded"
                    />
                  </th>
                  <th className="px-4 py-4 text-left">Product</th>
                  <th className="px-4 py-4 text-left">Category</th>
                  <th className="px-4 py-4 text-left">Brand</th>
                  <th className="px-4 py-4 text-left">Price</th>
                  <th className="px-4 py-4 text-left">Stock</th>
                  <th className="px-4 py-4 text-left">Deleted</th>
                  <th className="px-4 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product._id}
                    className="border-b transition hover:bg-gray-50"
                  >
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProducts((prev) => [...prev, product._id]);
                          } else {
                            setSelectedProducts((prev) =>
                              prev.filter((id) => id !== product._id)
                            );
                          }
                        }}
                        className="h-4 w-4 cursor-pointer rounded"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={
                            product.thumbnail?.url ||
                            "https://placehold.co/80x80?text=No+Image"
                          }
                          alt={typeof product.title === "object" ? product.title?.en : product.title}
                          className="h-16 w-16 rounded-lg border object-cover"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {typeof product.title === "object" ? product.title?.en : product.title}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            {product.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 capitalize">{product.category}</td>
                    <td className="px-4 py-4 capitalize">{product.brand || "-"}</td>
                    <td className="px-4 py-4 font-semibold">
                      ${Number(product.price).toFixed(2)}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`font-semibold ${
                          product.stock <= 5 ? "text-red-500" : "text-green-600"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {product.deletedAt
                        ? new Date(product.deletedAt).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleRestore(product._id)}
                          className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white transition hover:bg-green-700"
                        >
                          <RotateCcw size={18} />
                          Restore
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
                        >
                          <Trash2 size={18} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ProductPagination
            pagination={pagination}
            page={page}
            setPage={setPage}
          />
        </>
      )}
    </div>
  );
};

export default RecycleBinProducts;