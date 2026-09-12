import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { permanentDeleteCoupon } from "../services/couponService";

const usePermanentDeleteCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: permanentDeleteCoupon,

    onSuccess: (data) => {
      toast.success(
        data?.message ||
          "Coupon permanently deleted."
      );

      queryClient.invalidateQueries({
        queryKey: ["coupons"],
      });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to permanently delete coupon."
      );
    },
  });
};

export default usePermanentDeleteCoupon;