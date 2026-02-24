import { useTheme } from "@/hooks/useTheme";
import logoWhite from "@/assets/new Final IMI LOGO.png";
import logoBlack from "@/assets/WhatsApp Image 2025-09-08 at 6.23.45 PM.png";

const Footer = () => {
  const { theme } = useTheme();
  const logo = theme === "dark" ? logoWhite : logoBlack;

  return (
    <footer className="border-t border-border/50 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <img src={logo} alt="IMI" className="h-8 w-auto" />
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
