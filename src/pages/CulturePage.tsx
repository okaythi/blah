import { useState, useEffect } from "react";
import { Nav } from "../components/Nav";
import { CultureAPI } from "../api";
import type { CultureFact, CultureImage } from "../api";


export const CulturePage = () => {
  const [facts, setFacts] = useState<CultureFact[]>([]);
  const [images, setImages] = useState<CultureImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    CultureAPI.getAll().then(data => {
      setFacts(data.facts);
      setImages(data.images);
      setLoading(false);
    });
  }, []);

  return (
    <div className="pg" style={{ display: "flex", flexDirection: "column", flex: 1, padding: "24px" }}>
      <div className="bg-orb bg-orb--a" />
      <div className="bg-orb bg-orb--b" />
      <div className="bg-orb bg-orb--c" />
      
      <div style={{ zIndex: 10 }}>
        <Nav />
      </div>
      
      <main className="search-main" style={{ maxWidth: "1200px", margin: "0 auto", width: "100%", marginTop: "48px" }}>
        <header style={{ textAlign: "center", marginBottom: "48px" }}>
          <p style={{ color: "var(--fg2)", maxWidth: "600px", margin: "0 auto", lineHeight: "1.6", textAlign: "center", fontSize: "0.95rem" }}>
            Verken de rijke taalkundige geschiedenis van Landen. Ontdek fascinerende feiten, historische kaarten en lokale fotografie die ons erfgoed en het dialect van 't Lanes tot leven brengen.
          </p>
        </header>

        {loading ? (
          <div style={{ textAlign: "center", color: "var(--fg2)" }}>Laden...</div>
        ) : (
          <div className="culture-grid" style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
            gap: "24px", 
            alignItems: "start" 
          }}>
            {facts.map(fact => (
              <div key={fact.id} className="card" style={{ padding: "24px", background: "var(--gls2)", borderRadius: "var(--br)", border: "1px solid var(--gls-br)" }}>
                <p style={{ fontSize: "1.1rem", lineHeight: "1.5" }}>{fact.fact}</p>
              </div>
            ))}
            {images.map(img => (
              <div key={img.id} className="card" style={{ borderRadius: "var(--br)", overflow: "hidden", border: "1px solid var(--gls-br)" }}>
                <img src={img.image_url} alt={img.caption || ""} style={{ width: "100%", display: "block" }} />
                {img.caption && (
                  <div style={{ padding: "12px 16px", background: "var(--gls)", fontSize: "0.9rem", color: "var(--fg2)" }}>
                    {img.caption}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
