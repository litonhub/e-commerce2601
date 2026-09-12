import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Loader2, AlertTriangle } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts";
import {
  getProductStats,
  getInventoryAnalytics,
  getCategoryAnalytics,
  getBrandAnalytics,
} from "../../api/productApi";
import { getAllOrders } from "../../services/orderService";

// New page — no Analytics screen existed in the original app (the four
// API functions this reads from had zero consumers). Built to match
// the dashboard's existing card style, with charts for the parts a
// plain number can't show well.

const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6"];

const StatCard = ({ label, value }) => (
  <div className="rounded-2xl border border-brdr bg-white p-5 shadow-sm">
    <p className="text-2xl font-bold text-gray-900">{value}</p>
    <p className="text-sm text-gray-500">{label}</p>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="rounded-2xl border border-brdr bg-white p-6 shadow-sm">
    <h3 className="mb-4 text-base font-semibold text-gray-800">{title}</h3>
    <div style={{ width: "100%", height: 280 }}>{children}</div>
  </div>
);

const AdminAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [productStats, setProductStats] = useState(null);
  const [inventory, setInventory] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [brandData, setBrandData] = useState([]);
  const [revenueByDay, setRevenueByDay] = useState([]);
  const [statusBreakdown, setStatusBreakdown] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [statsRes, invRes, catRes, brandRes, ordersRes] = await Promise.all([
          getProductStats(),
          getInventoryAnalytics(),
          getCategoryAnalytics(),
          getBrandAnalytics(),
          getAllOrders(),
        ]);

        setProductStats(statsRes.data.data);
        setInventory(invRes.data.data);
        setCategoryData(catRes.data.data.map((c) => ({ name: c.category, products: c.productCount })));
        setBrandData(brandRes.data.data.slice(0, 6));

        const orders = ordersRes.data.orders;
        const byDay = {};
        orders.forEach((o) => {
          const day = new Date(o.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" });
          byDay[day] = (byDay[day] || 0) + (o.totalPrice || 0);
        });
        setRevenueByDay(Object.entries(byDay).map(([date, revenue]) => ({ date, revenue })));

        const byStatus = {};
        orders.forEach((o) => {
          byStatus[o.orderStatus] = (byStatus[o.orderStatus] || 0) + 1;
        });
        setStatusBreakdown(Object.entries(byStatus).map(([name, value]) => ({ name, value })));
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-24 text-gray-500">
        <Loader2 className="h-5 w-5 animate-spin" /> Crunching the numbers...
      </div>
    );
  }

  return (
    <div className="space-y-6 font-pop">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">Product, inventory, and sales at a glance.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Active Products" value={productStats.totalProducts} />
        <StatCard label="Avg. Price" value={`৳${Math.round(productStats.averagePrice).toLocaleString()}`} />
        <StatCard label="Stock Value" value={`৳${Math.round(productStats.totalStockValue).toLocaleString()}`} />
        <StatCard label="Out of Stock" value={productStats.outOfStock} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Products by Category">
          <ResponsiveContainer>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-20} textAnchor="end" height={60} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="products" fill="#22c55e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Revenue by Day">
          {revenueByDay.length === 0 ? (
            <p className="flex h-full items-center justify-center text-sm text-gray-400">No orders yet.</p>
          ) : (
            <ResponsiveContainer>
              <LineChart data={revenueByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip formatter={(v) => `৳${v.toLocaleString()}`} />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Top Brands">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={brandData} dataKey="productCount" nameKey="brand" outerRadius={90} label>
                {brandData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Orders by Status">
          {statusBreakdown.length === 0 ? (
            <p className="flex h-full items-center justify-center text-sm text-gray-400">No orders yet.</p>
          ) : (
            <ResponsiveContainer>
              <PieChart>
                <Pie data={statusBreakdown} dataKey="value" nameKey="name" outerRadius={90} label>
                  {statusBreakdown.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      {inventory?.lowStockProducts?.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-amber-800">
            <AlertTriangle size={18} /> Low Stock ({inventory.lowStockProducts.length})
          </h3>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {inventory.lowStockProducts.map((p) => (
              <div key={p._id} className="flex justify-between rounded-lg bg-white px-4 py-2 text-sm shadow-sm">
                <span className="text-gray-700">{p.title}</span>
                <span className="font-semibold text-amber-700">{p.stock} left</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnalytics;
