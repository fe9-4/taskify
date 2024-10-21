import Footer from "@/components/home/Footer";
import HeroSection from "@/components/home/HeroSection";
import MainSection from "@/components/home/MainSection";
import SubSection from "@/components/home/SubSection";

const Home = () => {
  return (
    <main className="flex flex-col items-center bg-black px-4 pt-[42px] md:px-[40px] md:pt-[94px]">
      <HeroSection />
      <MainSection />
      <SubSection />
      <Footer />
    </main>
  );
};

export default Home;
