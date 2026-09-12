import { useQuery } from "@tanstack/react-query";
import { getCart } from "../services/cartService";

const useCart = () => {
  return useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
  });
};

export default useCart;