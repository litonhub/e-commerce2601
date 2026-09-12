import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { createCoupon } from "../services/couponService";

const useCreateCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCoupon,

    onSuccess: (res) => {
      toast.success(
        res.message || "Coupon created successfully."
      );

      queryClient.invalidateQueries({
        queryKey: ["coupons"],
      });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to create coupon."
      );
    },
  });
};

export default useCreateCoupon;