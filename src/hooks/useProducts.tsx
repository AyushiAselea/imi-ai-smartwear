import { useState, useEffect } from "react";
import { fetchActiveProducts, type Product } from "@/lib/api";

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useProducts(): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = () => {
    setLoading(true);
    setError(null);
    fetchActiveProducts()
      .then((res) => {
        setProducts(res.products);
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetch();
  }, []);

  return { products, loading, error, refetch: fetch };
}
