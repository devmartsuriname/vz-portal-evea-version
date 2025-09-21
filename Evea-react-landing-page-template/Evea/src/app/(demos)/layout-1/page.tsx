import Navigation from "@/components/Navigation";
import Swiperslider from "@/components/Swiperslider";
import Footer from "@/components/Footer";
import Hero from "./components/Hero";
import Services from "@/components/Services";
import Features from "@/components/Features";
import Newsletter from "@/components/Newsletter";
import About from "@/components/About";
import Pricing from "@/components/Pricing";
import Faqs from "@/components/Faqs";
import Testimonials from "@/components/Testimonials";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";

function page() {
  
  return (
    <>
      <Navigation />
      <Hero/>
      <Services/>
      <Features />
      <Newsletter/>
      <About />
      <Pricing />
      <Faqs />
      <Swiperslider />
      <Testimonials />
      <Blog/>
      <Contact />
      <Footer />
    </>
  );
}

export default page;
