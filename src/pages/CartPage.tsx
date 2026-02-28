import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useProducts } from "@/hooks/useProducts";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, ShoppingBag, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { startPayment } from "@/lib/payment";
import { syncSocialUser } from "@/lib/api";
import type { ShippingAddress } from "@/lib/api";
import { toast } from "sonner";

const CartPage = () => {
  const { items, totalAmount, itemCount, loading, updateQuantity, removeItem, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const { products: backendProducts } = useProducts();
  const navigate = useNavigate();

  /* ── Checkout modal state ── */
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<"address" | "payment">("address");
  const [paymentMethod, setPaymentMethod] = useState<"ONLINE" | "COD" | "PARTIAL">("ONLINE");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });

  /* ── Helpers ── */
  const getBackendProductId = (cartProductId: string, cartProductName: string): string | null => {
    if (backendProducts.length === 0) return null;
    const match = backendProducts.find(
      (bp: any) =>
        bp._id === cartProductId ||
        bp.name.toLowerCase().includes(cartProductName.toLowerCase().replace("imi ", "")) ||
        bp.name.toLowerCase() === cartProductName.toLowerCase()
    );
    return match ? match._id : null;
  };

  const validateAddress = (): boolean => {
    if (!address.fullName.trim()) { toast.error("Full name is required"); return false; }
    if (!address.phone.trim() || address.phone.trim().length < 10) { toast.error("Valid phone number is required"); return false; }
    if (!address.addressLine1.trim()) { toast.error("Address line 1 is required"); return false; }
    if (!address.city.trim()) { toast.error("City is required"); return false; }
    if (!address.state.trim()) { toast.error("State is required"); return false; }
    if (!address.postalCode.trim() || address.postalCode.trim().length < 5) { toast.error("Valid postal code is required"); return false; }
    return true;
  };

  const handleProceedToCheckout = async () => {
    if (!user) { toast.info("Please sign in to continue with purchase"); navigate("/auth"); return; }
    let token = localStorage.getItem("imi_token") || "";
    if (!token && user.email) {
      try {
        toast.loading("Connecting to payment server...", { id: "sync-toast" });
        const res = await syncSocialUser(user.email, user.displayName || undefined, "google");
        localStorage.setItem("imi_token", res.token);
        token = res.token;
        toast.dismiss("sync-toast");
      } catch {
        toast.dismiss("sync-toast");
        toast.error("Unable to reach payment server. Please try again in a moment.");
        return;
      }
    }
    if (!token) { toast.info("Please sign in again to continue"); navigate("/auth"); return; }
    setShowCheckout(true);
    setCheckoutStep("address");
  };

  const handleProceedToPayment = () => { if (!validateAddress()) return; setCheckoutStep("payment"); };

  const handleConfirmOrder = async () => {
    setCheckoutLoading(true);
    try {
      const token = localStorage.getItem("imi_token") || "";
      if (!token) { toast.error("Session expired. Please sign in again."); navigate("/auth"); return; }
      const sessionId = sessionStorage.getItem("imi_session_id") || "";

      // Use first item's product ID if single item, otherwise aggregate
      if (items.length === 1) {
        const item = items[0];
        const backendId = getBackendProductId(item.productId, item.name);
        const payload = backendId
          ? { productId: backendId }
          : { productName: item.name, price: item.price };
        const result = await startPayment(payload, item.quantity, token, paymentMethod, address, sessionId);
        if (result.type === "cod") {
          await clearCart();
          toast.success("Order placed successfully! Pay on delivery.");
          setShowCheckout(false);
          navigate("/payment/success?method=cod");
        } else {
          // Online/Partial — redirect to PayU (cart will be cleared on success page)
          await clearCart();
        }
      } else {
        // Multiple items — aggregate into one payment
        const combinedNames = items.map((i) => i.name).join(", ");
        const payload = { productName: combinedNames, price: totalAmount };
        const result = await startPayment(payload, 1, token, paymentMethod, address, sessionId);
        if (result.type === "cod") {
          await clearCart();
          toast.success("Order placed successfully! Pay on delivery.");
          setShowCheckout(false);
          navigate("/payment/success?method=cod");
        } else {
          await clearCart();
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Payment failed. Please try again.");
    } finally {
      setCheckoutLoading(false);
    }
  };

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
                  onClick={handleProceedToCheckout}
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

      {/* ═══════════════ CHECKOUT MODAL ═══════════════ */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-foreground">{checkoutStep === "address" ? "Shipping Address" : "Payment Method"}</h2>
              <button onClick={() => setShowCheckout(false)} className="p-1 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"><X size={20} /></button>
            </div>

            {checkoutStep === "address" && (
              <div className="space-y-3">
                <input type="text" placeholder="Full Name *" value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm" />
                <input type="tel" placeholder="Phone Number *" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm" />
                <input type="text" placeholder="Address Line 1 *" value={address.addressLine1} onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm" />
                <input type="text" placeholder="Address Line 2 (Optional)" value={address.addressLine2} onChange={(e) => setAddress({ ...address, addressLine2: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm" />
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="City *" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm" />
                  <input type="text" placeholder="State *" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="PIN Code *" value={address.postalCode} onChange={(e) => setAddress({ ...address, postalCode: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm" />
                  <input type="text" placeholder="Country" value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm" />
                </div>
                <button onClick={handleProceedToPayment} className="w-full py-3 mt-2 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">Continue to Payment</button>
              </div>
            )}

            {checkoutStep === "payment" && (
              <div className="space-y-4">
                <div className="rounded-xl bg-background border border-border p-4 space-y-2">
                  {items.map((item) => (
                    <div key={`${item.productId}-${item.variant}`} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{item.name} × {item.quantity}</span>
                      <span className="text-foreground font-medium">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm border-t border-border pt-2 mt-2">
                    <span className="text-muted-foreground font-semibold">Total</span>
                    <span className="text-foreground font-bold">₹{totalAmount.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Ship to</span><span className="text-foreground text-right text-xs max-w-[60%]">{address.addressLine1}, {address.city}</span></div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Choose Payment</p>
                  {([
                    { id: "ONLINE" as const, title: "Pay Full Amount Online", desc: `₹${totalAmount.toLocaleString("en-IN")} via PayU (UPI / Card / Net Banking)` },
                    { id: "COD" as const, title: "Cash on Delivery", desc: `Pay ₹${totalAmount.toLocaleString("en-IN")} when delivered` },
                    { id: "PARTIAL" as const, title: "Pay 50% Now", desc: `Pay ₹${Math.round(totalAmount * 0.5).toLocaleString("en-IN")} now · ₹${Math.round(totalAmount * 0.5).toLocaleString("en-IN")} on delivery` },
                  ]).map((opt) => (
                    <label key={opt.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${paymentMethod === opt.id ? "border-primary bg-primary/5" : "border-border hover:border-foreground/30"}`}>
                      <input type="radio" name="pm" checked={paymentMethod === opt.id} onChange={() => setPaymentMethod(opt.id)} className="accent-primary" />
                      <div className="flex-1"><p className="text-sm font-medium text-foreground">{opt.title}</p><p className="text-xs text-muted-foreground">{opt.desc}</p></div>
                    </label>
                  ))}
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={() => setCheckoutStep("address")} className="flex-1 py-3 rounded-full border border-border text-foreground font-semibold text-sm hover:bg-secondary transition-colors">Back</button>
                  <button onClick={handleConfirmOrder} disabled={checkoutLoading} className="flex-1 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
                    {checkoutLoading ? "Processing..." : paymentMethod === "COD" ? "Place Order" : paymentMethod === "PARTIAL" ? `Pay ₹${Math.round(totalAmount * 0.5).toLocaleString("en-IN")} Now` : `Pay ₹${totalAmount.toLocaleString("en-IN")}`}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
