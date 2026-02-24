const Footer = () => {
  return (
    <footer className="border-t border-border/50 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-xl font-bold font-display">
          IMI<span className="text-primary">.</span>
        </div>
        <div className="flex gap-6 text-sm text-muted-foreground">
          <a href="#products" className="hover:text-foreground transition-colors">Products</a>
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#compare" className="hover:text-foreground transition-colors">Compare</a>
          <a href="#why" className="hover:text-foreground transition-colors">Why IMI</a>
        </div>
        <p className="text-xs text-muted-foreground">
          © 2026 IMI Technologies. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
