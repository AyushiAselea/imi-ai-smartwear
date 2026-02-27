import { useState, useEffect, useRef } from "react";
import { fetchActiveProducts, type Product } from "@/lib/api";

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 3000; // ms

export function useProducts(): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const retryCount = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const fetchProducts = (isRetry = false) => {
    if (!isRetry) retryCount.current = 0;
    setLoading(true);
    setError(null);
    fetchActiveProducts()
      .then((res) => {
        setProducts(res.products);
        retryCount.current = 0;
      })
      .catch((err) => {
        console.error(`Failed to fetch products (attempt ${retryCount.current + 1}):`, err);
        if (retryCount.current < MAX_RETRIES) {
          retryCount.current += 1;
          timerRef.current = setTimeout(() => fetchProducts(true), RETRY_DELAY);
          return; // keep loading state while retrying
        }
        setError(err.message);
      })
      .finally(() => {
        // Only stop loading if we're not about to retry
        if (retryCount.current === 0 || retryCount.current > MAX_RETRIES) {
          setLoading(false);
        }
      });
  };

  useEffect(() => {
    fetchProducts();
    return () => clearTimeout(timerRef.current);
  }, []);

  return { products, loading, error, refetch: fetchProducts };
}
