import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import MainSection from "./components/MainSection";
import SubSection from "./components/SubSection";

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
