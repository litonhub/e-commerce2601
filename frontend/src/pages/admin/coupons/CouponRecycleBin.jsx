import { Search, RotateCcw, Trash2 } from "lucide-react";
import { useState } from "react";

import useCoupons from "../../../hooks/useCoupons";
import useRestoreCoupon from "../../../hooks/useRestoreCoupon";
import usePermanentDeleteCoupon from "../../../hooks/usePermanentDeleteCoupon";

const CouponRecycleBin = () => {
  const [search, setSearch] = useState("");

  const { data: coupons = [], isLoading } = useCoupons({
    deleted: "true",
    q: search,
  });

  const { mutate: restoreCoupon } = useRestoreCoupon();

  const { mutate: permanentDelete } = usePermanentDeleteCoupon();

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Coupon Recycle Bin
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Restore deleted coupons or permanently remove them.
        </p>
      </div>

      {/* Search */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="relative max-w-md">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search deleted coupon..."
            className="h-11 w-full rounded-xl border border-gray-300 pl-11 pr-4 text-sm outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full">

            <thead className="bg-gray-50">
              <tr className="text-left text-sm font-semibold text-gray-700">
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Discount</th>
                <th className="px-6 py-4">Deleted At</th>
                <th className="px-6 py-4 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>

              {isLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-16 text-center text-gray-500"
                  >
                    Loading...
                  </td>
                </tr>
              ) : coupons.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-16 text-center text-gray-500"
                  >
                    No deleted coupons found.
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) => (
                  <tr
                    key={coupon._id}
                    className="border-t border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-6 py-5 font-semibold text-primary">
                      {coupon.code}
                    </td>

                    <td className="px-6 py-5">
                      {coupon.name}
                    </td>

                    <td className="px-6 py-5">
                      {coupon.discountType === "percentage"
                        ? `${coupon.discountValue}%`
                        : `৳${coupon.discountValue}`}
                    </td>

                    <td className="px-6 py-5">
                      {coupon.deletedAt
                        ? new Date(
                            coupon.deletedAt
                          ).toLocaleDateString()
                        : "--"}
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-2">

                        <button
                          onClick={() =>
                            restoreCoupon(coupon._id)
                          }
                          className="inline-flex items-center gap-2 rounded-lg border border-green-200 px-3 py-2 text-sm font-medium text-green-600 transition hover:bg-green-50"
                        >
                          <RotateCcw size={16} />
                          Restore
                        </button>

                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                "Permanently delete this coupon?"
                              )
                            ) {
                              permanentDelete(coupon._id);
                            }
                          }}
                          className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                          Permanent Delete
                        </button>

                      </div>
                    </td>
                  </tr>
                ))
              )}

            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
};

export default CouponRecycleBin;