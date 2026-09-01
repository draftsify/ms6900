
/**
 * Stocks currently in the distribution queue.
 * Drop a real SVG at `public/assets/logos/<file>` and add `logo: "<file>"`
 * to an entry — the tile renders the image instead of the monogram.
 */
export type Listing = {
  name: string;
  sym: string;
  logo?: string;
};

export const LISTINGS: Listing[] = [
  { name: "Anduril", sym: "AND", logo: "anduril.png" },
  { name: "OpenAI", sym: "OAI", logo: "openai.png" },
  { name: "Apple", sym: "AAPL", logo: "apple.png" },
  { name: "MSFTx", sym: "MS", logo: "msft.png" },
  { name: "NVDAx", sym: "NV", logo: "nvda.png" },
  { name: "AMZNx", sym: "AZ", logo: "amzn.png" },
  { name: "CRCLx", sym: "CR", logo: "crcl.png" },
  { name: "SPCXx", sym: "SP", logo: "spcx.png" },
  { name: "Anthropix", sym: "AN", logo: "anthropic.png" },
  { name: "Polymarket", sym: "PM", logo: "polymarket.png" },
  { name: "Kalshi", sym: "KL", logo: "kalshi.png" },
  { name: "Neuralink", sym: "NL", logo: "neuralink.png" },
  { name: "HOODx", sym: "HD", logo: "hood.png" },
  { name: "QQQx", sym: "QQ", logo: "qqq.png" },
  { name: "GPRO", sym: "GP", logo: "gpro.png" },
];

function Item({ l }: { l: Listing }) {
  return (
    <li className="tick">
      <span className="tick__mark">
        {l.logo ? (
          <img src={`/assets/logos/${l.logo}`} alt="" width={20} height={20} />
        ) : (
          l.sym
        )}
      </span>
      <span className="tick__name">{l.name}</span>
    </li>
  );
}

export default function Ticker() {
  return (
    <section className="strip" id="listings">
      <div className="strip__inner">
        <h2 className="strip__title" data-reveal>Stocks in the distribution queue</h2>

        <div className="marquee" data-reveal>
          <ul className="marquee__track">
            {LISTINGS.map((l) => (
              <Item key={l.name} l={l} />
            ))}
            {LISTINGS.map((l) => (
              <Item key={`${l.name}-clone`} l={l} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
