import { useState, useEffect } from "react";
import { Nav } from "../components/Nav";
import { CultureAPI, CultureFact, CultureImage } from "../api";
import { Landmark } from "lucide-react";

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
    <div className="pg">
      <div className="bg-orb bg-orb--a" />
      <div className="bg-orb bg-orb--b" />
      <div className="bg-orb bg-orb--c" />
      
      <Nav />
      
      <main className="search-main" style={{ maxWidth: "1200px" }}>
        <header style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "var(--gls2)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--gls-br)" }}>
              <Landmark size={24} color="var(--ac)" />
            </div>
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "16px" }}>
            Cultuur & Geschiedenis
          </h1>
          <p style={{ color: "var(--fg2)", maxWidth: "600px", margin: "0 auto", lineHeight: "1.6" }}>
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
