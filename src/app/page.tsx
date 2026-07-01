import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Benefits from "@/components/Benefits";
import AppPreview from "@/components/AppPreview";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Comparison from "@/components/Comparison";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import CTAFinal from "@/components/CTAFinal";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Benefits />
      <AppPreview />
      <Features />
      <HowItWorks />
      <Comparison />
      <Testimonials />
      <FAQ />
      <CTAFinal />
      <Footer />
    </>
  );
}
