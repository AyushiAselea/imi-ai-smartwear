import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import {
  fetchCart,
  addToCartAPI,
  updateCartItemAPI,
  removeFromCartAPI,
  clearCartAPI,
  CartItem,
  CartResponse,
} from "@/lib/api";

const TOKEN_KEY = "imi_token";

interface CartContextType {
  items: CartItem[];
  totalAmount: number;
  itemCount: number;
  loading: boolean;
  addToCart: (item: { productId: string; name: string; price: number; image?: string; variant?: string; quantity?: number }) => Promise<void>;
  updateQuantity: (productId: string, quantity: number, variant?: string) => Promise<void>;
  removeItem: (productId: string, variant?: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType>({
  items: [],
  totalAmount: 0,
  itemCount: 0,
  loading: false,
  addToCart: async () => {},
  updateQuantity: async () => {},
  removeItem: async () => {},
  clearCart: async () => {},
  refreshCart: async () => {},
});

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  const getToken = () => localStorage.getItem(TOKEN_KEY);

  const updateFromResponse = (data: CartResponse) => {
    setItems(data.items || []);
    setTotalAmount(data.totalAmount || 0);
  };

  const refreshCart = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setItems([]);
      setTotalAmount(0);
      return;
    }
    try {
      setLoading(true);
      const data = await fetchCart(token);
      updateFromResponse(data);
    } catch {
      // Silently fail — user might not be logged in yet
    } finally {
      setLoading(false);
    }
  }, []);

  // Load cart on mount and when auth changes
  useEffect(() => {
    refreshCart();

    // Listen for storage changes (login/logout in other tabs)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === TOKEN_KEY) {
        refreshCart();
      }
    };
    window.addEventListener("storage", handleStorage);

    // Poll for token changes within the same tab (no HTTP — only localStorage check)
    let prevToken = getToken();
    const interval = setInterval(() => {
      const token = getToken();
      if (token !== prevToken) {
        prevToken = token;
        if (!token) {
          setItems([]);
          setTotalAmount(0);
        } else {
          refreshCart();
        }
      }
    }, 1000);

    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, [refreshCart]);

  const addToCart = async (item: { productId: string; name: string; price: number; image?: string; variant?: string; quantity?: number }) => {
    const token = getToken();
    if (!token) throw new Error("Please log in to add items to cart");
    const data = await addToCartAPI(item, token);
    updateFromResponse(data);
  };

  const updateQuantity = async (productId: string, quantity: number, variant?: string) => {
    const token = getToken();
    if (!token) return;
    const data = await updateCartItemAPI(productId, quantity, token, variant);
    updateFromResponse(data);
  };

  const removeItem = async (productId: string, variant?: string) => {
    const token = getToken();
    if (!token) return;
    const data = await removeFromCartAPI(productId, token, variant);
    updateFromResponse(data);
  };

  const clearCartFn = async () => {
    const token = getToken();
    if (!token) return;
    const data = await clearCartAPI(token);
    updateFromResponse(data);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        totalAmount,
        itemCount,
        loading,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart: clearCartFn,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
