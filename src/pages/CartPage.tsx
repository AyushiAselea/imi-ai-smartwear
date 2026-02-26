import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const CartPage = () => {
  const { items, totalAmount, itemCount, loading, updateQuantity, removeItem, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 pt-32">
          <ShoppingCart size={64} className="text-muted-foreground/30 mb-6" />
          <h1 className="text-2xl font-bold mb-2">Sign in to view your cart</h1>
          <p className="text-muted-foreground mb-6">Please log in to add items and manage your cart.</p>
          <Link
            to="/auth"
            className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
          >
            Sign In
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 pt-32 pb-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Your Cart</h1>
            <p className="text-muted-foreground mt-1">
              {itemCount === 0 ? "No items yet" : `${itemCount} item${itemCount > 1 ? "s" : ""}`}
            </p>
          </div>
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1.5 transition-colors"
            >
              <Trash2 size={14} />
              Clear All
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
          </div>
        ) : items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <ShoppingBag size={72} className="text-muted-foreground/20 mb-6" />
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8 text-center max-w-sm">
              Looks like you haven't added any IMI Smart Glasses to your cart yet.
            </p>
            <Link
              to="/#products"
              className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
            >
              Explore Products
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {items.map((item, idx) => (
              <motion.div
                key={`${item.productId}-${item.variant}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-card"
              >
                {/* Image */}
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-xl bg-muted"
                  />
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">{item.name}</h3>
                  {item.variant && (
                    <p className="text-xs text-muted-foreground capitalize mt-0.5">{item.variant}</p>
                  )}
                  <p className="text-primary font-semibold mt-1">
                    ₹{item.price.toLocaleString("en-IN")}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variant)}
                    className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variant)}
                    className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Subtotal */}
                <p className="text-sm font-semibold w-24 text-right">
                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                </p>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.productId, item.variant)}
                  className="p-2 text-muted-foreground hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}

            {/* Summary */}
            <div className="mt-8 p-6 rounded-2xl border border-border bg-card">
              <div className="flex items-center justify-between mb-4">
                <span className="text-muted-foreground">Subtotal ({itemCount} items)</span>
                <span className="text-lg font-bold">₹{totalAmount.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex items-center justify-between mb-6 text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-4 mb-6">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-bold text-primary">₹{totalAmount.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate("/#products")}
                  className="flex-1 py-3 rounded-full border border-border font-semibold text-sm hover:bg-muted transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={16} />
                  Continue Shopping
                </button>
                <button
                  onClick={() => {
                    // Navigate to the first product's page for checkout
                    // In a multi-item checkout, you'd redirect to a checkout page
                    if (items.length === 1) {
                      const slug = items[0].productId;
                      navigate(`/product/${slug}`);
                    } else {
                      navigate(`/product/${items[0].productId}`);
                    }
                  }}
                  className="flex-1 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;
