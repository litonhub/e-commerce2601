import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
  EllipsisVertical,
  Pencil,
  Trash2,
  RotateCcw,
  Power,
} from "lucide-react";
import { Link } from "react-router";

import useDeleteCoupon from "../../hooks/useDeleteCoupon";
import useRestoreCoupon from "../../hooks/useRestoreCoupon";
import useToggleCouponStatus from "../../hooks/useToggleCouponStatus";
import usePermanentDeleteCoupon from "../../hooks/usePermanentDeleteCoupon";

const CouponActionMenu = ({ coupon }) => {
  const { mutate: deleteCoupon, isPending: deleting } =
    useDeleteCoupon();

  const { mutate: restoreCoupon, isPending: restoring } =
    useRestoreCoupon();

  const {
    mutate: permanentDeleteCoupon,
    isPending: permanentDeleting,
  } = usePermanentDeleteCoupon();

  const { mutate: toggleStatus, isPending: toggling } =
    useToggleCouponStatus();

  return (
    <Menu as="div" className="relative">
      <MenuButton className="rounded-lg p-2 hover:bg-gray-100">
        <EllipsisVertical size={18} />
      </MenuButton>

      <MenuItems className="absolute right-0 z-20 mt-2 w-52 rounded-xl border border-gray-200 bg-white shadow-lg focus:outline-none">

        {!coupon.isDeleted && (
          <>
            <MenuItem>
              <Link
                to={`/admin-dashboard/coupons/edit/${coupon._id}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
              >
                <Pencil size={16} />
                Edit
              </Link>
            </MenuItem>

            <MenuItem>
              <button
                disabled={toggling}
                onClick={() => toggleStatus(coupon._id)}
                className="flex w-full items-center gap-3 px-4 py-3 hover:bg-gray-50 disabled:opacity-50"
              >
                <Power size={16} />
                {coupon.isActive ? "Deactivate" : "Activate"}
              </button>
            </MenuItem>

            <MenuItem>
              <button
                disabled={deleting}
                onClick={() => deleteCoupon(coupon._id)}
                className="flex w-full items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </MenuItem>
          </>
        )}

        {coupon.isDeleted && (
          <>
            <MenuItem>
              <button
                disabled={restoring}
                onClick={() => restoreCoupon(coupon._id)}
                className="flex w-full items-center gap-3 px-4 py-3 text-green-600 hover:bg-green-50 disabled:opacity-50"
              >
                <RotateCcw size={16} />
                Restore
              </button>
            </MenuItem>

            <MenuItem>
              <button
                disabled={permanentDeleting}
                onClick={() =>
                  permanentDeleteCoupon(coupon._id)
                }
                className="flex w-full items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                <Trash2 size={16} />
                Permanent Delete
              </button>
            </MenuItem>
          </>
        )}
      </MenuItems>
    </Menu>
  );
};

export default CouponActionMenu;