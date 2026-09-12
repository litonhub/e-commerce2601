import { Link } from "react-router";
import { Plus } from "lucide-react";

const CouponHeader = () => {
  return (
    <div className="flex items-center justify-between">

      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Coupons
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage all discount coupons.
        </p>
      </div>

      <Link
        to="/admin-dashboard/coupons/add"
        className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
      >
        <Plus size={18} />

        Add Coupon
      </Link>

    </div>
  );
};

export default CouponHeader;