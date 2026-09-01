import Hero from "./components/Hero";
import ClaimPanel from "./components/ClaimPanel";
import Ticker from "./components/Ticker";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main>
      <Hero>
        <ClaimPanel embedded />
      </Hero>
      <Ticker />
      <Footer />
    </main>
  );
}
