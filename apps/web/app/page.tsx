import Features from "@/components/landing/Features";
import GetStarted from "@/components/landing/GetStarted";
import Header from "@/components/landing/Header";
import Pricing from "@/components/landing/Pricing";
import WhyUs from "@/components/landing/WhyUs";

export default function Home() {
  return (
    <section className="flex flex-col gap-40">
      <Header />
      <WhyUs />
      <Features />
      <Pricing />
      <GetStarted />
    </section>
  );
}
