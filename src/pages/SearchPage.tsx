import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { DictionaryAPI } from "../api";
import type { SearchResult } from "../api";
import { RC } from "../components/RC";
import { Nav } from "../components/Nav";

export const S = () => {
  const [q, sq] = useState("");
  const [r, sr] = useState<SearchResult[]>([]);
  const [ld, sld] = useState(false);
  const [hs, shs] = useState(false);
  const [tc, stc] = useState<number | null>(null);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    DictionaryAPI.getStats().then(d => {
      if (d !== null) stc(d);
    });
  }, []);

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
      const results = await DictionaryAPI.search(q);
      sr(results);
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

      <div className="wrap" style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', top: 24, left: 24, right: 24, zIndex: 10 }}>
          <Nav />
        </div>
        <div className={`hero ${act ? "hero--shifted" : ""}`}>
          <div className="logo">
            <div className="logo-dot" />
            <span className="logo-text">
              {tc !== null ? `${tc} woord${tc === 1 ? '' : 'en'}` : "'t Lanes"}
            </span>
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
              placeholder="Zoek een woord..."
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
          <div className="empty">Geen resultaten gevonden voor "{q}"</div>
        )}

        {r.length > 0 && (
          <div className="lst">
            {r.map((x) => (
              <RC key={x.id} e={x} xrefs={x.xrefs} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};
