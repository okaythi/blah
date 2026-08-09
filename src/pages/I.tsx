import { useState, useEffect, useMemo } from "react";
import type { Entry, XRef } from "../types";
import { parseEntry, POS_SHORT } from "../types";
import { DictionaryAPI, SearchResult } from "../api";
import { RC } from "../components/RC";
import { Nav } from "../components/Nav";

export const I = () => {
  const [data, setData] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    DictionaryAPI.getAll().then((d) => {
      setData(d);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const grouped = useMemo(() => {
    const groups: Record<string, SearchResult[]> = {};
    for (const e of data) {
      const first = e.word_lanes.charAt(0).toUpperCase();
      const letter = first.match(/[A-Z]/) ? first : "#";
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(e);
    }
    return groups;
  }, [data]);

  const alphabet = Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ");

  return (
    <>
      <div className="bg-mesh"><div className="bg-orb bg-orb--a" /><div className="bg-orb bg-orb--b" /></div>
      <div className="bg-grid" />
      <div className="bg-noise" />

      <div className="wrap" style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: 0 }}>
        <div style={{ padding: '24px 24px 0' }}>
          <Nav />
        </div>

        <div className="idx-container">
          <div className="idx-sidebar">
            {alphabet.map((letter) => {
              const hasWords = !!grouped[letter];
              return (
                <a 
                  key={letter} 
                  href={hasWords ? `#letter-${letter}` : undefined}
                  className={`idx-letter-link ${!hasWords ? "idx-letter-link--disabled" : ""}`}
                >
                  {letter}
                </a>
              );
            })}
          </div>

          <div className="idx-content">
            {loading && <div className="spin" style={{ margin: "40px auto" }} />}
            
            {!loading && Object.keys(grouped).sort().map((letter) => (
              <div key={letter} id={`letter-${letter}`} className="idx-section">
                <div className="idx-section-header">{letter}</div>
                <div className="idx-list">
                  {grouped[letter].map((e) => (
                    <div key={e.id} className="idx-row-wrap">
                      <div 
                        className={`idx-row ${expandedId === e.id ? "idx-row--expanded" : ""}`}
                        onClick={() => setExpandedId(expandedId === e.id ? null : e.id)}
                      >
                        <div className="idx-row-word">{e.word_lanes}</div>
                        <div className="idx-row-nl">{e.word_nl}</div>
                        <div className="idx-row-pos">{e.pos ? POS_SHORT[e.pos] : ""}</div>
                      </div>
                      
                      {expandedId === e.id && (
                        <div className="idx-expanded">
                          <RC e={e} xrefs={e.xrefs} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
