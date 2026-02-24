import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductsSection from "@/components/ProductsSection";
import FeaturesSection from "@/components/FeaturesSection";
import ComparisonSection from "@/components/ComparisonSection";
import WhyImiSection from "@/components/WhyImiSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>AI Smart Glasses in India | IMI Mark 1 & Mark 2</title>
        <meta
          name="description"
          content="Discover IMI AI smart glasses with voice assistant, camera, calling, and vision AI. Affordable wearable tech built for the future."
        />
        <meta name="keywords" content="AI smart glasses India, smart glasses with camera, voice assistant glasses, vision AI glasses, affordable smart glasses, wearable AI glasses" />
      </Helmet>
      <Navbar />
      <main>
        <HeroSection />
        <ProductsSection />
        <FeaturesSection />
        <ComparisonSection />
        <WhyImiSection />
        <TestimonialsSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
};

export default Index;
