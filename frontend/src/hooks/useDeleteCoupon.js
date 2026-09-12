import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteCoupon } from "../services/couponService";

const useDeleteCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCoupon,

    onSuccess: (data) => {
      toast.success(data?.message || "Coupon deleted successfully");

      queryClient.invalidateQueries({
        queryKey: ["coupons"],
      });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete coupon"
      );
    },
  });
};

export default useDeleteCoupon;