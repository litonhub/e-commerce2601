import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { toggleCouponStatus } from "../services/couponService";

const useToggleCouponStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleCouponStatus,

    onSuccess: (data) => {
      toast.success(data?.message || "Coupon status updated");

      queryClient.invalidateQueries({
        queryKey: ["coupons"],
      });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to update status"
      );
    },
  });
};

export default useToggleCouponStatus;