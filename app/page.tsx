import Nav from "./components/Nav";
import ClaimPanel from "./components/ClaimPanel";
import Ticker from "./components/Ticker";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main>
      <Nav />
      <ClaimPanel embedded />
      <Ticker />
      <Footer />
    </main>
  );
}
