import Categories from "@/components/mainPage/Categories";
import Hero from "@/components/mainPage/Hero";
import Trending from "@/components/mainPage/Trending";

export default function Home() {
  return (
    <div className="">
      <main >
        <Hero />
        <Categories />
        <Trending />
      </main>
    </div>
  );
}
