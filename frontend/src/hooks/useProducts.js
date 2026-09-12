import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../services/productService";

const useProducts = (search) => {
  return useQuery({
    queryKey: ["products", search],

    queryFn: () => getProducts(search),

    staleTime: 1000 * 60 * 5,
  });
};

export default useProducts;