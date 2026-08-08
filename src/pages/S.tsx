import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";

interface Entry {
  id: string;
  word_lanes: string;
  ipa: string;
  word_nl: string;
  example_sentence: string;
  additional_metadata: string;
}

export const S = () => {
  const [q, sq] = useState("");
  const [r, sr] = useState<Entry[]>([]);
  const [ld, sld] = useState(false);
  const [hs, shs] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== ref.current) {
        e.preventDefault();
        ref.current?.focus();
      }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  useEffect(() => {
    if (!q.trim()) {
      sr([]);
      shs(false);
      return;
    }
    sld(true);
    const id = setTimeout(async () => {
      try {
        const rs = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}`);
        if (rs.ok) {
          const d: Entry[] = await rs.json();
          sr(d);
        }
      } catch {}
      sld(false);
      shs(true);
    }, 250);
    return () => clearTimeout(id);
  }, [q]);

  const act = q.trim().length > 0;

  return (
    <>
      <div className="bg-mesh">
        <div className="bg-orb bg-orb--a" />
        <div className="bg-orb bg-orb--b" />
        <div className="bg-orb bg-orb--c" />
      </div>
      <div className="bg-grid" />
      <div className="bg-noise" />

      <div className="wrap">
        <div className={`hero ${act ? "hero--shifted" : ""}`}>
          <div className="logo">
            <div className="logo-dot" />
            <span className="logo-text">'t Lanes</span>
          </div>
          <h1 className="hd">Lanes Woordenboek</h1>
          {!act && <p className="sub">Zoek woorden op in AN of in 't Lanes en vind hun tegenhangers!</p>}
        </div>

        <div className={`search-wrap ${act ? "search-wrap--shifted" : ""}`}>
          <div className="search-box">
            <Search className="search-icon" size={20} />
            <input
              ref={ref}
              className="inp"
              type="text"
              placeholder="Search for a word..."
              value={q}
              onChange={(e) => sq(e.target.value)}
            />
            {!act && (
              <div className="kbd">
                <span className="kbd-key">/</span>
              </div>
            )}
          </div>
        </div>

        {ld && (
          <div className="cnt">
            <div className="spin" />
          </div>
        )}

        {!ld && hs && r.length === 0 && (
          <div className="empty">No results found for "{q}"</div>
        )}

        {r.length > 0 && (
          <div className="lst">
            {r.map((x) => (
              <div key={x.id} className="itm">
                <div className="itm-head">
                  <span className="itm-word">{x.word_lanes}</span>
                  {x.ipa && <span className="itm-ipa">/{x.ipa}/</span>}
                </div>
                <div className="itm-nl">{x.word_nl}</div>
                {x.example_sentence && (
                  <div className="itm-ex">"{x.example_sentence}"</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
