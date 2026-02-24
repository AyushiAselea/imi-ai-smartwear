import { useState } from "react";
import { Menu, X, User, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, loading, signOut } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="text-2xl font-bold tracking-tight font-display">
          IMI<span className="text-primary">.</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="/#products" className="hover:text-foreground transition-colors">Products</a>
          <a href="/#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="/#compare" className="hover:text-foreground transition-colors">Compare</a>
          <a href="/#why" className="hover:text-foreground transition-colors">Why IMI</a>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {!loading && (
            <>
              {user ? (
                <>
                  <span className="text-xs text-muted-foreground truncate max-w-[140px]">{user.email}</span>
                  <button
                    onClick={signOut}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full border border-border text-foreground hover:bg-secondary transition-colors"
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </>
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
          <Link to="/product/mark-1" className="px-5 py-2.5 text-sm font-semibold rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
            Shop Now
          </Link>
        </div>

        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
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
              <a href="/#products" onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">Products</a>
              <a href="/#features" onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">Features</a>
              <a href="/#compare" onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">Compare</a>
              <a href="/#why" onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">Why IMI</a>
              {!loading && (
                user ? (
                  <button onClick={() => { signOut(); setOpen(false); }} className="text-left text-muted-foreground hover:text-foreground flex items-center gap-2">
                    <LogOut size={14} /> Logout
                  </button>
                ) : (
                  <Link to="/auth" onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground flex items-center gap-2">
                    <User size={14} /> Sign In
                  </Link>
                )
              )}
              <Link to="/product/mark-1" onClick={() => setOpen(false)} className="px-5 py-2.5 text-sm font-semibold rounded-full bg-primary text-primary-foreground text-center">Shop Now</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
