import Categories from "@/components/mainPage/Categories";
import Community from "@/components/mainPage/Community";
import Hero from "@/components/mainPage/Hero";
import Marquee from "@/components/mainPage/Marquee";
import SuccessStories from "@/components/mainPage/SuccessStories";
import Trending from "@/components/mainPage/Trending";
import TrustBadges from "@/components/mainPage/TrustBadges";
import ShopByGoal from "@/components/ShopByGoal";

export default function Home() {
  return (
    <div className="">
      <main >
        <Hero />
        <Marquee />
        <Categories />
        <Trending />
        <SuccessStories />
        <TrustBadges />
        <Community />
        <ShopByGoal/>
      </main>
    </div>
  );
}
