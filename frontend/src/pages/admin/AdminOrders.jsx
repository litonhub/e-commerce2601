import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { Loader2, PackageSearch, Eye } from "lucide-react";
import { getAllOrders, updateOrderStatus, deleteOrder } from "../../services/orderService";
import useDebounce from "../../hooks/useDebounce";

// New page — no admin Orders screen existed in the original app (only
// the service functions did). Built to match the existing Products /
// CategoryList list-page pattern so it feels native to the dashboard.

const ORDER_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

const STATUS_STYLES = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const PAYMENT_STYLES = {
  paid: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  unpaid: "bg-gray-200 text-gray-700",
};

const StatusBadge = ({ value, styles }) => (
  <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${styles[value] || "bg-gray-200 text-gray-700"}`}>
    {value || "—"}
  </span>
);

const AdminOrders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter) params.status = statusFilter;
      const res = await getAllOrders(params);
      setOrders(res.data.orders || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const filtered = orders.filter((o) => {
    if (!debouncedSearch.trim()) return true;
    const q = debouncedSearch.trim().toLowerCase();
    return o._id.toLowerCase().includes(q) || (o.user?.email || "").toLowerCase().includes(q);
  });

  const handleStatusChange = async (id, status) => {
    try {
      const res = await updateOrderStatus(id, { orderStatus: status });
      toast.success(res.message);
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, orderStatus: status } : o)));
    } catch (err) {
      toast.error(err.response?.data?.message || "Status update failed");
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this order? This can't be undone.");
    if (!ok) return;

    try {
      const res = await deleteOrder(id);
      toast.success(res.message);
      setOrders((prev) => prev.filter((o) => o._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-6 font-pop">
      <div className="rounded-2xl border border-brdr bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
            <p className="mt-1 text-sm text-gray-500">All orders placed on the store.</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order ID or email..."
              className="w-full rounded-xl border border-brdr px-4 py-2.5 text-sm outline-none focus:border-primary sm:w-64"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-brdr px-4 py-2.5 text-sm outline-none focus:border-primary"
            >
              <option value="">All statuses</option>
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s} className="capitalize">
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-gray-500">
            <Loader2 className="h-5 w-5 animate-spin" /> Loading orders...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-gray-500">
            <PackageSearch className="h-10 w-10 opacity-50" />
            <p>No orders match your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-200 shadow-sm">
              <thead>
                <tr className="border-b-2 border-brdrtwo bg-gray-50 text-left text-logoc">
                  <th className="px-4 py-4">Order ID</th>
                  <th className="px-4 py-4">Customer</th>
                  <th className="px-4 py-4">Date</th>
                  <th className="px-4 py-4">Items</th>
                  <th className="px-4 py-4">Total</th>
                  <th className="px-4 py-4">Payment</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-4 font-medium text-gray-800">#{order._id.slice(-8)}</td>
                    <td className="px-4 py-4 text-gray-600">{order.user?.email || "—"}</td>
                    <td className="px-4 py-4 text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-4 text-gray-600">{order.totalItems}</td>
                    <td className="px-4 py-4 font-semibold text-gray-800">৳{order.totalPrice?.toLocaleString()}</td>
                    <td className="px-4 py-4">
                      <StatusBadge value={order.paymentStatus} styles={PAYMENT_STYLES} />
                    </td>
                    <td className="px-4 py-4">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`rounded-full border-0 px-3 py-1 text-xs font-semibold capitalize outline-none ${STATUS_STYLES[order.orderStatus] || "bg-gray-200 text-gray-700"}`}
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => navigate(`/admin-dashboard/orders/${order._id}`)}
                          className="text-primary hover:opacity-70"
                          title="View details"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(order._id)}
                          className="text-sm font-medium text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
