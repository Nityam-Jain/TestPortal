"use client";

import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeatureSection";
import Statistics from "../components/Statistics";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";
import ContactSection from "../components/ContactSection";
import FAQ from "../components/FAQ";
import ContactUs from "../components/ContactUs";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-100 to-navy-300">
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Statistics Section */}
      <Statistics />

      {/* CTA Section */}
      <CTASection />
      <FAQ />
      <ContactUs />

      {/* Footer */}
      <Footer />
    </div>
  );
}
