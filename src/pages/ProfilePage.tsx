import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Package, Truck, CheckCircle, Clock, XCircle, ChevronDown, ChevronUp, User, MapPin, CreditCard, LogOut } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { fetchMyOrders } from "@/lib/api";

/* ── Order types matching backend schema ── */
interface OrderProduct {
  product?: { _id: string; name: string; price: number; image?: string } | null;
  productName?: string;
  price?: number;
  quantity: number;
}

interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface Order {
  _id: string;
  products: OrderProduct[];
  totalAmount: number;
  advanceAmount?: number;
  remainingAmount?: number;
  paymentMethod: "ONLINE" | "COD" | "PARTIAL";
  paymentStatus: "Pending" | "Success" | "Failed" | "Partial";
  deliveryPaymentPending?: boolean;
  shippingAddress?: ShippingAddress | null;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  createdAt: string;
  updatedAt: string;
}

/* ── Status helpers ── */
const statusConfig: Record<string, { icon: any; color: string; bg: string }> = {
  Pending: { icon: Clock, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  Processing: { icon: Package, color: "text-blue-500", bg: "bg-blue-500/10" },
  Shipped: { icon: Truck, color: "text-purple-500", bg: "bg-purple-500/10" },
  Delivered: { icon: CheckCircle, color: "text-green-500", bg: "bg-green-500/10" },
  Cancelled: { icon: XCircle, color: "text-red-500", bg: "bg-red-500/10" },
};

const paymentBadge = (method: string, status: string) => {
  if (status === "Success") return { label: "Paid", cls: "bg-green-500/10 text-green-600" };
  if (status === "Partial") return { label: "Partial Paid", cls: "bg-amber-500/10 text-amber-600" };
  if (method === "COD") return { label: "COD — Pay on Delivery", cls: "bg-orange-500/10 text-orange-600" };
  if (status === "Pending") return { label: "Payment Pending", cls: "bg-yellow-500/10 text-yellow-600" };
  return { label: status, cls: "bg-muted text-muted-foreground" };
};

/* ── Timeline step component ── */
const steps = ["Pending", "Processing", "Shipped", "Delivered"];

const OrderTimeline = ({ currentStatus }: { currentStatus: string }) => {
  const currentIdx = steps.indexOf(currentStatus);
  const isCancelled = currentStatus === "Cancelled";

  return (
    <div className="flex items-center gap-1 mt-4">
      {steps.map((step, idx) => {
        const done = !isCancelled && idx <= currentIdx;
        const active = !isCancelled && idx === currentIdx;
        return (
          <div key={step} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  done
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                } ${active ? "ring-2 ring-primary/40 ring-offset-2 ring-offset-card" : ""}`}
              >
                {done ? "✓" : idx + 1}
              </div>
              <span className={`text-[10px] mt-1 ${done ? "text-primary font-semibold" : "text-muted-foreground"}`}>
                {step}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className={`h-0.5 flex-1 rounded-full -mt-4 ${idx < currentIdx && !isCancelled ? "bg-primary" : "bg-border"}`} />
            )}
          </div>
        );
      })}
      {isCancelled && (
        <div className="flex flex-col items-center ml-2">
          <div className="w-7 h-7 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center text-xs font-bold">✕</div>
          <span className="text-[10px] mt-1 text-red-500 font-semibold">Cancelled</span>
        </div>
      )}
    </div>
  );
};

/* ── Order card ── */
const OrderCard = ({ order, idx }: { order: Order; idx: number }) => {
  const [expanded, setExpanded] = useState(false);
  const sc = statusConfig[order.status] || statusConfig.Pending;
  const StatusIcon = sc.icon;
  const pb = paymentBadge(order.paymentMethod, order.paymentStatus);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
      className="rounded-2xl border border-border bg-card overflow-hidden"
    >
      {/* Header */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-4 p-4 text-left hover:bg-muted/30 transition-colors"
      >
        <div className={`w-10 h-10 rounded-xl ${sc.bg} flex items-center justify-center shrink-0`}>
          <StatusIcon size={20} className={sc.color} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-foreground text-sm">
              {order.products.map((p) => p.product?.name || p.productName || "Product").join(", ")}
            </h3>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${pb.cls}`}>{pb.label}</span>
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
            <span>{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
            <span>•</span>
            <span className="font-semibold text-foreground">₹{order.totalAmount.toLocaleString("en-IN")}</span>
            <span>•</span>
            <span className={`font-medium ${sc.color}`}>{order.status}</span>
          </div>
        </div>
        {expanded ? <ChevronUp size={18} className="text-muted-foreground" /> : <ChevronDown size={18} className="text-muted-foreground" />}
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-border px-4 pb-4 pt-3 space-y-4">
          {/* Timeline */}
          <OrderTimeline currentStatus={order.status} />

          {/* Products */}
          <div className="space-y-2 pt-2">
            {order.products.map((p, i) => {
              const name = p.product?.name || p.productName || "Product";
              const price = p.product?.price || p.price || 0;
              const image = p.product?.image;
              return (
                <div key={i} className="flex items-center gap-3">
                  {image ? (
                    <img src={image} alt={name} className="w-12 h-12 rounded-lg object-cover bg-muted" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                      <Package size={18} className="text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{name}</p>
                    <p className="text-xs text-muted-foreground">Qty: {p.quantity} × ₹{price.toLocaleString("en-IN")}</p>
                  </div>
                  <p className="text-sm font-semibold">₹{(price * p.quantity).toLocaleString("en-IN")}</p>
                </div>
              );
            })}
          </div>

          {/* Payment info */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CreditCard size={14} />
              <span>Payment: <span className="text-foreground font-medium">{order.paymentMethod}</span></span>
            </div>
            {order.advanceAmount != null && order.advanceAmount > 0 && (
              <div className="text-muted-foreground">
                Advance Paid: <span className="text-foreground font-medium">₹{order.advanceAmount.toLocaleString("en-IN")}</span>
              </div>
            )}
            {order.remainingAmount != null && order.remainingAmount > 0 && (
              <div className="text-muted-foreground">
                Remaining: <span className="text-foreground font-medium">₹{order.remainingAmount.toLocaleString("en-IN")}</span>
              </div>
            )}
          </div>

          {/* Shipping address */}
          {order.shippingAddress && (
            <div className="rounded-xl bg-background border border-border p-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground mb-1.5">
                <MapPin size={12} />
                Shipping Address
              </div>
              <p className="text-sm text-foreground leading-relaxed">
                {order.shippingAddress.fullName}<br />
                {order.shippingAddress.addressLine1}
                {order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ""}<br />
                {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.postalCode}<br />
                {order.shippingAddress.phone}
              </p>
            </div>
          )}

          <p className="text-[10px] text-muted-foreground text-right">
            Order ID: {order._id}
          </p>
        </div>
      )}
    </motion.div>
  );
};

/* ================================================================ */
/*  PROFILE PAGE                                                    */
/* ================================================================ */
const ProfilePage = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("imi_token");
    if (!token) { setLoadingOrders(false); return; }
    setLoadingOrders(true);
    fetchMyOrders(token)
      .then((data: any) => {
        setOrders(Array.isArray(data) ? data : []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoadingOrders(false));
  }, [user]);

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
          <User size={64} className="text-muted-foreground/30 mb-6" />
          <h1 className="text-2xl font-bold mb-2">Sign in to view your profile</h1>
          <p className="text-muted-foreground mb-6">Please log in to see your orders and account info.</p>
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
    <>
      <Helmet>
        <title>My Profile | IMI AI Smart Glasses</title>
      </Helmet>
      <Navbar />

      <main className="pt-32 pb-16 max-w-4xl mx-auto px-6">
        {/* ── User Header ── */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl font-bold shrink-0">
            {(user.displayName || user.email || "U")[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold tracking-tight truncate">{user.displayName || "IMI User"}</h1>
            <p className="text-sm text-muted-foreground truncate">{user.email}</p>
          </div>
          <button
            onClick={() => { signOut(); navigate("/"); }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-border text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>

        {/* ── Orders Section ── */}
        <div className="mb-6">
          <h2 className="text-lg font-bold tracking-tight">My Orders</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Track and manage all your purchases</p>
        </div>

        {loadingOrders ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold"
            >
              Retry
            </button>
          </div>
        ) : orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <Package size={72} className="text-muted-foreground/20 mb-6" />
            <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
            <p className="text-muted-foreground mb-8 text-center max-w-sm">
              Once you purchase IMI Smart Glasses, your orders will appear here.
            </p>
            <Link
              to="/shop"
              className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
            >
              Shop Now
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {orders.map((order, idx) => (
              <OrderCard key={order._id} order={order} idx={idx} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
};

export default ProfilePage;
