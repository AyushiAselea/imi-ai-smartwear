import { useState } from "react";
import { Menu, X, User, LogOut, Sun, Moon, ShoppingCart, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { useCart } from "@/hooks/useCart";
import logoWhite from "@/assets/new Final IMI LOGO.png";
import logoBlack from "@/assets/WhatsApp Image 2025-09-08 at 6.23.45 PM.png";
import logoSmallWhite from "@/assets/new Final IMI LOGO.png";

const BANNER_HEIGHT = "h-9"; // 36px

const PromoBanner = () => (
  <div className={`fixed top-0 left-0 right-0 z-[60] ${BANNER_HEIGHT} bg-gradient-to-r from-primary via-teal-600 to-primary text-white flex items-center overflow-hidden`}>
    <div className="animate-marquee whitespace-nowrap flex items-center gap-12 text-sm font-medium">
      <span className="flex items-center gap-2">
        🔥 Buy IMI Mark 1 at <strong>₹2,499</strong> — Limited offer for first 100 users!
      </span>
      <img src={logoSmallWhite} alt="IMI" className="h-4 w-auto opacity-70" />
      <span className="flex items-center gap-2">
        🔥 Buy IMI Mark 1 at <strong>₹2,499</strong> — Limited offer for first 100 users!
      </span>
      <img src={logoSmallWhite} alt="IMI" className="h-4 w-auto opacity-70" />
      <span className="flex items-center gap-2">
        🔥 Buy IMI Mark 1 at <strong>₹2,499</strong> — Limited offer for first 100 users!
      </span>
      <img src={logoSmallWhite} alt="IMI" className="h-4 w-auto opacity-70" />
      <span className="flex items-center gap-2">
        🔥 Buy IMI Mark 1 at <strong>₹2,499</strong> — Limited offer for first 100 users!
      </span>
      <img src={logoSmallWhite} alt="IMI" className="h-4 w-auto opacity-70" />
    </div>
  </div>
);

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const { user, loading, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { itemCount } = useCart();

  const logo = theme === "dark" ? logoWhite : logoBlack;

  return (
    <>
    <PromoBanner />
    <nav className="fixed top-9 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="IMI" className="h-8 w-auto" />
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="/#products" className="hover:text-foreground transition-colors">Home</a>
          <a href="/#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="/#compare" className="hover:text-foreground transition-colors">Compare</a>
          <a href="/#why" className="hover:text-foreground transition-colors">Why IMI</a>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full border border-border text-foreground hover:bg-secondary transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <Link
            to="/cart"
            className="relative p-2 rounded-full border border-border text-foreground hover:bg-secondary transition-colors"
            aria-label="Cart"
          >
            <ShoppingCart size={16} />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center px-1">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>
          {!loading && (
            <>
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen((v) => !v)}
                    title={user.displayName || user.email || undefined}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary border border-border hover:bg-secondary/80 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                      {(user.displayName || user.email || "U")[0].toUpperCase()}
                    </div>
                    <svg className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  <AnimatePresence>
                    {dropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                        <motion.div
                          initial={{ opacity: 0, y: -8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-44 rounded-xl bg-card border border-border shadow-xl overflow-hidden z-50"
                        >
                          <div className="px-4 py-3 border-b border-border">
                            <p className="text-xs text-muted-foreground">Signed in as</p>
                            <p className="text-sm font-semibold text-foreground truncate">{user.displayName || user.email}</p>
                          </div>
                          <Link
                            to="/profile"
                            onClick={() => setDropdownOpen(false)}
                            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-foreground hover:bg-secondary transition-colors"
                          >
                            <Package size={14} />
                            My Orders
                          </Link>
                          <button
                            onClick={() => { signOut(); setDropdownOpen(false); }}
                            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                          >
                            <LogOut size={14} />
                            Logout
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold rounded-full border border-border text-foreground hover:bg-secondary transition-colors"
                >
                  <User size={14} />
                  Sign In
                </Link>
              )}
            </>
          )}
          <Link to="/shop" className="px-5 py-2.5 text-sm font-semibold rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
            Shop Now
          </Link>
        </div>

        <div className="flex md:hidden items-center gap-2">
          <Link
            to="/cart"
            className="relative p-2 rounded-full border border-border text-foreground hover:bg-secondary transition-colors"
            aria-label="Cart"
          >
            <ShoppingCart size={18} />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center px-1">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full border border-border text-foreground hover:bg-secondary transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button className="text-foreground" onClick={() => setOpen(!open)}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-border/50"
          >
            <div className="flex flex-col gap-4 px-6 py-6 text-sm font-medium">
              <a href="/#products" onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">HOME </a>
              <a href="/#features" onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">Features</a>
              <a href="/#compare" onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">Compare</a>
              <a href="/#why" onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">Why IMI</a>
              {!loading && (
                user ? (
                  <div className="flex items-center justify-between">
                    <div className="relative">
                      <button
                        onClick={() => setMobileDropdownOpen((v) => !v)}
                        className="flex items-center gap-2"
                        title={user.displayName || user.email || undefined}
                      >
                        <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                          {(user.displayName || user.email || "U")[0].toUpperCase()}
                        </div>
                      </button>
                      <AnimatePresence>
                        {mobileDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            className="absolute left-0 mt-2 w-40 rounded-md bg-card border border-border shadow-md z-40 overflow-hidden"
                          >
                            <Link
                              to="/profile"
                              onClick={() => { setOpen(false); setMobileDropdownOpen(false); }}
                              className="w-full flex items-center px-4 py-3 text-sm text-foreground hover:bg-secondary"
                            >
                              <Package size={14} className="inline mr-2" /> My Orders
                            </Link>
                            <button
                              onClick={() => { signOut(); setOpen(false); setMobileDropdownOpen(false); }}
                              className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10"
                            >
                              <LogOut size={14} className="inline mr-2" /> Logout
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                ) : (
                  <Link to="/auth" onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground flex items-center gap-2">
                    <User size={14} /> Sign In
                  </Link>
                )
              )}
              <Link to="/shop" onClick={() => setOpen(false)} className="px-5 py-2.5 text-sm font-semibold rounded-full bg-primary text-primary-foreground text-center">Shop Now</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
    </>
  );
};

export default Navbar;
