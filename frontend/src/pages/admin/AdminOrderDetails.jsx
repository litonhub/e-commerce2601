import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { toast } from "react-toastify";
import { ArrowLeft, Loader2 } from "lucide-react";
import { getSingleOrder, updateOrderStatus } from "../../services/orderService";

const ORDER_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

const AddressBlock = ({ title, address }) => (
  <div className="rounded-xl border border-brdr bg-gray-50 p-5">
    <h4 className="mb-2 text-sm font-semibold text-gray-500">{title}</h4>
    {address ? (
      <div className="text-sm text-gray-700">
        <p className="font-medium text-gray-900">{address.firstName} {address.lastName}</p>
        <p>{address.street}, {address.city}, {address.state?.name || address.state}</p>
        <p>{address.country?.name || address.country} - {address.zipCode}</p>
        {address.phone && <p className="mt-1">{address.phone}</p>}
        {address.email && <p>{address.email}</p>}
      </div>
    ) : (
      <p className="text-sm text-gray-400">Not provided.</p>
    )}
  </div>
);

const AdminOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await getSingleOrder(id);
      setOrder(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Order not found");
      navigate("/admin-dashboard/orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleStatusChange = async (status) => {
    try {
      const res = await updateOrderStatus(id, { orderStatus: status });
      toast.success(res.message);
      setOrder((prev) => ({ ...prev, orderStatus: status }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Status update failed");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-24 text-gray-500">
        <Loader2 className="h-5 w-5 animate-spin" /> Loading order...
      </div>
    );
  }

  if (!order) return null;

  const items = order.items || order.orderItems || [];

  return (
    <div className="space-y-6 font-pop">
      <Link to="/admin-dashboard/orders" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary">
        <ArrowLeft size={16} /> Back to orders
      </Link>

      <div className="rounded-2xl border border-brdr bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order #{order._id.slice(-8)}</h1>
            <p className="mt-1 text-sm text-gray-500">
              Placed {new Date(order.createdAt).toLocaleString()} · {order.user?.email}
            </p>
          </div>
          <select
            value={order.orderStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="rounded-xl border border-brdr px-4 py-2.5 text-sm font-semibold capitalize outline-none focus:border-primary"
          >
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <AddressBlock title="Shipping Address" address={order.shippingAddress} />
          <AddressBlock title="Billing Address" address={order.billingAddress} />
        </div>

        <div className="mb-6 overflow-x-auto rounded-xl border border-brdr">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-brdr bg-gray-50 text-left text-sm text-gray-500">
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Qty</th>
                <th className="px-4 py-3 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i} className="border-b border-gray-100 last:border-none">
                  <td className="flex items-center gap-3 px-4 py-3">
                    {item.thumbnail && <img src={item.thumbnail} alt="" className="h-10 w-10 rounded-lg object-cover" />}
                    <span className="text-sm text-gray-800">
                      {typeof item.title === "object" ? item.title.en : item.title || item.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">৳{item.price}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.quantity}</td>
                  <td className="px-4 py-3 text-right text-sm font-medium text-gray-800">৳{item.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="ml-auto max-w-xs space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span><span>৳{order.subTotal?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Shipping</span><span>৳{order.shippingPrice?.toLocaleString()}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span><span>-৳{order.discount?.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-brdr pt-2 text-base font-bold text-gray-900">
            <span>Total</span><span>৳{order.totalPrice?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between pt-2 text-gray-500">
            <span>Payment method</span><span className="capitalize">{order.paymentMethod}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Payment status</span><span className="capitalize">{order.paymentStatus}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetails;
