import { useQuery } from "@tanstack/react-query";
import { getCoupons } from "../services/couponService";


const useCoupons = (filters) => {
  return useQuery({
    queryKey: ["coupons", filters],
    queryFn: () => getCoupons(filters),
    staleTime: 1000 * 60 * 5,
  });
};


export default useCoupons;