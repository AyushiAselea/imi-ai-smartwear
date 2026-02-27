import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductShowcaseSection from "@/components/ProductShowcaseSection";
import VideoCarousel from "@/components/VideoCarousel";

import FeaturesSection from "@/components/FeaturesSection";
import ComparisonSection from "@/components/ComparisonSection";
import VersionsSection from "@/components/VersionsSection";
import ExploreTechSection from "@/components/ExploreTechSection";
import WhyImiSection from "@/components/WhyImiSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>IMI | AI Smart Glasses India</title>
        <meta
          name="description"
          content="Discover IMI AI smart glasses with voice assistant, camera, calling, and vision AI. Affordable wearable tech built for the future."
        />
        <meta name="keywords" content="AI smart glasses India, smart glasses with camera, voice assistant glasses, vision AI glasses, affordable smart glasses, wearable AI glasses" />
      </Helmet>
      <Navbar />
      <main>
        <HeroSection />
        <VideoCarousel />
        <ProductShowcaseSection />
        <VersionsSection />
        <ExploreTechSection />
        <TestimonialsSection />
        <ComparisonSection />
        <FeaturesSection />
        <WhyImiSection />
        
        <CtaSection />
      </main>
      <Footer />
    </>
  );
};

export default Index;
