import useCoupons from "../../hooks/useCoupons";
import CouponStatusBadge from "./CouponStatusBadge";
import CouponActionMenu from "./CouponActionMenu";

const CouponTable = ({ filters, onDelete, onRestore }) => {
  const { data: coupons = [], isLoading } = useCoupons(filters);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white py-16 text-center text-gray-500 shadow-sm">
        Loading coupons...
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr className="text-left text-sm font-semibold text-gray-700">
              <th className="px-6 py-4">Code</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Discount</th>
              <th className="px-6 py-4">Min Order</th>
              <th className="px-6 py-4">Usage</th>
              <th className="px-6 py-4">Expire</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {coupons.length > 0 ? (
              coupons.map((coupon) => (
                <tr
                  key={coupon._id}
                  className="border-t border-gray-100 transition hover:bg-gray-50"
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
                    ৳{coupon.minimumOrderAmount}
                  </td>

                  <td className="px-6 py-5">
                    {coupon.usedCount || 0} / {coupon.usageLimit || 0}
                  </td>

                  <td className="px-6 py-5">
                    {new Date(coupon.expireDate).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-5">
                    <CouponStatusBadge
                      isActive={coupon.isActive}
                      isDeleted={coupon.isDeleted}
                      expireDate={coupon.expireDate}
                    />
                  </td>

                  <td className="px-6 py-5 text-right">
                    <CouponActionMenu
                      coupon={coupon}
                      onDelete={() => onDelete(coupon)}
                      onRestore={() => onRestore(coupon)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="py-16 text-center text-gray-500">
                  No coupons found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CouponTable;