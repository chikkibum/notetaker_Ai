import { FAQSection } from "@/components/sections/faq-section";
import Features from "@/components/sections/features";
import { NewReleasePromo } from "@/components/sections/new-release-promo";
import { PricingSection } from "@/components/sections/pricing-section";
import { StickyFooter } from "@/components/sections/sticky-footer";
import { TestimonialsSection } from "@/components/sections/testimonials";
import Hero from "@/components/home/hero";

export default function Home() {
  return (
    <main className="flex min-h-screen font-sans font-medium  text-6xl  flex-col items-center justify-between ">
      <Hero />

{/* Features Section */}
<div id="features">
        <Features/>
      </div>

      {/* Pricing Section */}
      <div id="pricing">
        <PricingSection />
      </div>

      {/* Testimonials Section */}
      <div id="testimonials">
        <TestimonialsSection />
      </div>

      <NewReleasePromo />

      {/* FAQ Section */}
      <div id="faq">
        <FAQSection />
      </div>

      {/* Sticky Footer */}
      <StickyFooter />
    </main>
  );
}