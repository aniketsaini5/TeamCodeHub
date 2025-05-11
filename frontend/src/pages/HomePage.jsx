import Hero from "../components/Hero";
import Features from "../components/Features";
import About from "../components/About";
import HowItWorks from "../components/HowItWorks";
import Contact from "../components/Contact";

const HomePage = () => {
  return (
    <main>
      <section id="Hero">
        <Hero />
      </section>
      <section id="Features">
        <Features />
      </section>
      <section id="About">
        <About />
      </section>
      <section id="HowItWorks">
        <HowItWorks />
      </section>
      <section id="Contact">
        <Contact />
      </section>
    </main>
  );
};

export default HomePage;