import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { restoreCoupon } from "../services/couponService";

const useRestoreCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restoreCoupon,

    onSuccess: (data) => {
      toast.success(data?.message || "Coupon restored successfully");

      queryClient.invalidateQueries({
        queryKey: ["coupons"],
      });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to restore coupon"
      );
    },
  });
};

export default useRestoreCoupon;