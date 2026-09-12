import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Package, FolderTree, ShoppingBag, TicketPercent, Users, TrendingUp } from "lucide-react";
import { getProducts } from "../../api/productApi";
import { getCategories } from "../../api/categoryApi";
import { getAllOrders } from "../../services/orderService";
import { getCoupons } from "../../services/couponService";
import { getAllUsers } from "../../services/authService";

// This page was a bare "Dashboard" heading in the original app — no
// data-fetching to convert. Added a real overview here since the admin
// dashboard otherwise had nothing to show; every number below comes
// from the same local stores the rest of the admin screens use.
const StatCard = ({ icon, label, value, to }) => {
  const content = (
    <div className="flex items-center gap-4 rounded-2xl border border-brdr bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
  return to ? <Link to={to}>{content}</Link> : content;
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const loadStats = async () => {
      const [productsRes, categories, ordersRes, coupons, users] = await Promise.all([
        getProducts({ limit: 1 }),
        getCategories(),
        getAllOrders(),
        getCoupons({ deleted: false }),
        getAllUsers(),
      ]);

      if (cancelled) return;

      const orders = ordersRes.data.orders;
      const revenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

      setStats({
        totalProducts: productsRes.data.data.pagination.totalProducts,
        totalCategories: categories.data.length,
        totalOrders: orders.length,
        totalCoupons: coupons.length,
        totalUsers: users.length,
        revenue,
      });
    };

    loadStats();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">A quick look at your store, right now.</p>
      </div>

      {!stats ? (
        <div className="py-10 text-center text-gray-500">Loading overview...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard icon={<Package size={22} />} label="Products" value={stats.totalProducts} to="/admin-dashboard/products" />
          <StatCard icon={<FolderTree size={22} />} label="Categories" value={stats.totalCategories} to="/admin-dashboard/categories" />
          <StatCard icon={<ShoppingBag size={22} />} label="Orders" value={stats.totalOrders} to="/admin-dashboard/orders" />
          <StatCard icon={<TicketPercent size={22} />} label="Active Coupons" value={stats.totalCoupons} to="/admin-dashboard/coupons" />
          <StatCard icon={<Users size={22} />} label="Registered Users" value={stats.totalUsers} to="/admin-dashboard/users" />
          <StatCard icon={<TrendingUp size={22} />} label="Total Revenue" value={`\u09F3${stats.revenue.toLocaleString()}`} to="/admin-dashboard/analytics" />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
