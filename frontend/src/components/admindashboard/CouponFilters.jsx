import { Search, RotateCcw, Trash2 } from "lucide-react";

const CouponFilters = ({
  filters,
  setFilters,
}) => {
  const handleChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleReset = () => {
    setFilters({
      q: "",
      status: "",
      discountType: "",
      deleted: "false",
    });
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        {/* Left */}
        <div className="flex flex-1 flex-col gap-4 md:flex-row">

          <div className="relative w-full md:max-w-sm">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              name="q"
              value={filters.q}
              onChange={handleChange}
              placeholder="Search coupon..."
              className="h-11 w-full rounded-xl border border-gray-300 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-primary"
            />
          </div>

          <select
            name="status"
            value={filters.status}
            onChange={handleChange}
            className="h-11 rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-primary"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            name="discountType"
            value={filters.discountType}
            onChange={handleChange}
            className="h-11 rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-primary"
          >
            <option value="">All Types</option>
            <option value="percentage">
              Percentage
            </option>
            <option value="fixed">
              Fixed Amount
            </option>
          </select>

        </div>

        {/* Right */}
        <div className="flex items-center gap-3">

          <button
            type="button"
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                deleted:
                  prev.deleted === "true"
                    ? "false"
                    : "true",
              }))
            }
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-red-200 px-4 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            <Trash2 size={18} />
            {filters.deleted === "true"
              ? "Active Coupons"
              : "Recycle Bin"}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-gray-300 px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            <RotateCcw size={18} />
            Reset
          </button>

        </div>
      </div>
    </div>
  );
};

export default CouponFilters;