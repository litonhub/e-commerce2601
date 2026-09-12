import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Loader2, Users as UsersIcon } from "lucide-react";
import { getAllUsers } from "../../services/authService";
import { getAllOrders } from "../../services/orderService";
import useDebounce from "../../hooks/useDebounce";

// New page — no admin Users screen existed in the original app.
// Read-only by design: role changes and account actions felt like more
// risk than this phase needed to take on, so it's a clear list for now.

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [orderCounts, setOrderCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [allUsers, ordersRes] = await Promise.all([getAllUsers(), getAllOrders()]);
        setUsers(allUsers);

        const counts = {};
        ordersRes.data.orders.forEach((o) => {
          counts[o.userId] = (counts[o.userId] || 0) + 1;
        });
        setOrderCounts(counts);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = users.filter((u) => {
    if (!debouncedSearch.trim()) return true;
    const q = debouncedSearch.trim().toLowerCase();
    return u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 font-pop">
      <div className="rounded-2xl border border-brdr bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Users</h1>
            <p className="mt-1 text-sm text-gray-500">Everyone registered on the store.</p>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or email..."
            className="w-full rounded-xl border border-brdr px-4 py-2.5 text-sm outline-none focus:border-primary sm:w-72"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-gray-500">
            <Loader2 className="h-5 w-5 animate-spin" /> Loading users...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-gray-500">
            <UsersIcon className="h-10 w-10 opacity-50" />
            <p>No users match your search.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-200 shadow-sm">
              <thead>
                <tr className="border-b-2 border-brdrtwo bg-gray-50 text-left text-logoc">
                  <th className="px-4 py-4">User</th>
                  <th className="px-4 py-4">Email</th>
                  <th className="px-4 py-4">Phone</th>
                  <th className="px-4 py-4">Role</th>
                  <th className="px-4 py-4">Orders</th>
                  <th className="px-4 py-4">Joined</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="flex items-center gap-3 px-4 py-4">
                      {u.avatar ? (
                        <img src={u.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
                      ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                          {(u.name || u.email)?.[0]?.toUpperCase()}
                        </div>
                      )}
                      <span className="font-medium text-gray-800">{u.name}</span>
                    </td>
                    <td className="px-4 py-4 text-gray-600">{u.email}</td>
                    <td className="px-4 py-4 text-gray-600">{u.phone || "—"}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                          u.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-600">{orderCounts[u._id] || 0}</td>
                    <td className="px-4 py-4 text-gray-600">{new Date(u.createdAt).toLocaleDateString()}</td>
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

export default AdminUsers;
