import Features from "@/components/landing/Features";
import GetStarted from "@/components/landing/Get-started";
import Header from "@/components/landing/Header";
import Plans from "@/components/landing/Plans";
import TrendingGuilds from "@/components/landing/Trending-guilds";
import WhyUs from "@/components/landing/Why-us";

export default function Home() {
  return (
    <section className="flex flex-col gap-40">
      <Header />
      <TrendingGuilds />
      <WhyUs />
      <Features />
      <Plans />
      <GetStarted />
    </section>
  );
}
