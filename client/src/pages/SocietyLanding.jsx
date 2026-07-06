import {
  Navbar,
  Hero,
  Stats,
  Features,
  HowItWorks,
  Pricing,
  Contact,
  Footer,
} from "./LandingPage";

export default function SocietyLanding() {
  return (
    <div className="min-h-screen font-sans">
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <Pricing />
      <Contact />
      <Footer />
    </div>
  );
}
