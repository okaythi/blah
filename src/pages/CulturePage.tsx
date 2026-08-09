import { useState, useEffect } from "react";
import { Nav } from "../components/Nav";
import { CultureAPI } from "../api";
import type { CultureFact, CultureImage, CultureAudio } from "../api";

type Tab = 'Overzicht' | 'Taalkunde' | 'Geschiedenis';

export const CulturePage = () => {
  const [activeTab, setActiveTab] = useState<Tab>('Overzicht');
  const [facts, setFacts] = useState<CultureFact[]>([]);
  const [images, setImages] = useState<CultureImage[]>([]);
  const [audios, setAudios] = useState<CultureAudio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    CultureAPI.getAll().then(data => {
      setFacts(data.facts);
      setImages(data.images);
      setAudios(data.audios);
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
      
      <main className="search-main" style={{ maxWidth: "1200px", margin: "0 auto", width: "100%", marginTop: "24px" }}>
        
        {/* Pills Navigation */}
        <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginBottom: "32px", overflowX: "auto" }}>
          {(['Overzicht', 'Taalkunde', 'Geschiedenis'] as Tab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pill ${activeTab === tab ? 'active' : ''}`}
              style={{
                padding: "8px 16px",
                borderRadius: "9999px",
                border: "1px solid var(--gls-br)",
                background: activeTab === tab ? "var(--fg)" : "var(--gls)",
                color: activeTab === tab ? "var(--bg)" : "var(--fg2)",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'Overzicht' && (
          <section>
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <h2 style={{ fontSize: "2rem", marginBottom: "16px", color: "var(--fg)" }}>The Merovingian Legacy</h2>
              <p style={{ color: "var(--fg2)", maxWidth: "800px", margin: "0 auto", lineHeight: "1.8", fontSize: "1.1rem" }}>
                Pippin of Landen (c. 580 – 640), also known as Pippin the Elder, was the Mayor of the Palace of Austrasia under the Merovingian kings. Though not a king himself, he wielded immense power, effectively ruling the kingdom behind the scenes. His lineage founded the dynasty that would eventually displace the Merovingians entirely, forever tying Landen's soil to the birth of the Carolingian empire.
              </p>
            </div>

            {loading ? (
              <div style={{ textAlign: "center", color: "var(--fg2)" }}>Laden...</div>
            ) : (
              <div className="masonry-grid" style={{ 
                columnCount: 3, 
                columnGap: "24px" 
              }}>
                {facts.map(fact => (
                  <div key={fact.id} className="card masonry-item" style={{ breakInside: "avoid", marginBottom: "24px", padding: "32px", background: "var(--gls2)", borderRadius: "var(--br)", border: "1px solid var(--gls-br)" }}>
                    <p style={{ fontSize: "1.1rem", lineHeight: "1.6", color: "var(--fg)" }}>{fact.fact}</p>
                  </div>
                ))}
                {images.map(img => (
                  <div key={img.id} className="card masonry-item" style={{ breakInside: "avoid", marginBottom: "24px", borderRadius: "var(--br)", overflow: "hidden", border: "1px solid var(--gls-br)" }}>
                    <img src={img.image_url} alt={img.caption || ""} style={{ width: "100%", display: "block", filter: "grayscale(80%) contrast(1.2)" }} />
                    {img.caption && (
                      <div style={{ padding: "16px", background: "var(--gls)", fontSize: "0.95rem", color: "var(--fg2)" }}>
                        {img.caption}
                      </div>
                    )}
                  </div>
                ))}
                {images.length === 0 && (
                   <div className="card masonry-item" style={{ breakInside: "avoid", marginBottom: "24px", borderRadius: "var(--br)", overflow: "hidden", border: "1px solid var(--gls-br)", height: "300px", background: "var(--gls2)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--fg2)", filter: "grayscale(80%) contrast(1.2)" }}>
                      <p>Placeholder Image (Desaturated Cobblestone)</p>
                   </div>
                )}
              </div>
            )}
          </section>
        )}

        {activeTab === 'Taalkunde' && (
          <section>
            <div style={{ marginBottom: "48px" }}>
              <h2 style={{ fontSize: "2rem", marginBottom: "16px", color: "var(--fg)" }}>The Ingvaeonic Influence</h2>
              <div className="card" style={{ padding: "32px", background: "var(--gls2)", borderRadius: "var(--br)", border: "1px solid var(--gls-br)" }}>
                <p style={{ color: "var(--fg2)", lineHeight: "1.8", fontSize: "1.1rem", marginBottom: "16px" }}>
                  The local dialect of Landen is fascinatingly shaped by historical linguistic shifts, most notably the <strong>Ingvaeonic nasal spirant law</strong>. This phonological development occurred in languages around the North Sea, but its echoes reached inland.
                </p>
                <p style={{ color: "var(--fg2)", lineHeight: "1.8", fontSize: "1.1rem" }}>
                  It caused the loss of nasal consonants ('n' or 'm') before fricatives ('f', 's', 'th'). This is precisely why we say <em>"vijf"</em> (five) and <em>"zacht"</em> (soft), contrasting with German forms that retained the nasal like <em>"fünf"</em> and <em>"sanft"</em>.
                </p>
              </div>
            </div>

            <div>
              <h2 style={{ fontSize: "2rem", marginBottom: "24px", color: "var(--fg)" }}>Native Speaker Audio Archive</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {audios.length > 0 ? audios.map(audio => (
                  <div key={audio.id} className="card" style={{ display: "flex", alignItems: "center", gap: "24px", padding: "24px", background: "var(--gls)", borderRadius: "var(--br)", border: "1px solid var(--gls-br)" }}>
                    <button style={{ width: "48px", height: "48px", borderRadius: "50%", background: "var(--fg)", color: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer", flexShrink: 0 }}>▶</button>
                    <div style={{ flex: 1 }}>
                      <div style={{ height: "4px", background: "var(--gls2)", borderRadius: "2px", width: "100%", position: "relative" }}>
                        <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: "0%", background: "var(--fg)", borderRadius: "2px" }} />
                      </div>
                    </div>
                    {audio.caption && <span style={{ color: "var(--fg2)", fontSize: "0.9rem" }}>{audio.caption}</span>}
                  </div>
                )) : (
                  <>
                    <div className="card" style={{ display: "flex", alignItems: "center", gap: "24px", padding: "24px", background: "var(--gls)", borderRadius: "var(--br)", border: "1px solid var(--gls-br)" }}>
                      <button style={{ width: "48px", height: "48px", borderRadius: "50%", background: "var(--fg)", color: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer", flexShrink: 0 }}>▶</button>
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
                        <div style={{ height: "4px", background: "var(--gls2)", borderRadius: "2px", width: "100%" }} />
                        <span style={{ color: "var(--fg2)", fontSize: "0.85rem" }}>Placeholder: "T is beter blô gebleve as groen geschete."</span>
                      </div>
                    </div>
                    <div className="card" style={{ display: "flex", alignItems: "center", gap: "24px", padding: "24px", background: "var(--gls)", borderRadius: "var(--br)", border: "1px solid var(--gls-br)" }}>
                      <button style={{ width: "48px", height: "48px", borderRadius: "50%", background: "var(--fg)", color: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer", flexShrink: 0 }}>▶</button>
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
                        <div style={{ height: "4px", background: "var(--gls2)", borderRadius: "2px", width: "100%" }} />
                        <span style={{ color: "var(--fg2)", fontSize: "0.85rem" }}>Placeholder: "Haa de kak mor in aa broek."</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>
        )}

        {activeTab === 'Geschiedenis' && (
          <section>
            <div style={{ marginBottom: "64px" }}>
              <h2 style={{ fontSize: "2rem", marginBottom: "24px", color: "var(--fg)", textAlign: "center" }}>The Merovingian Ancestry Tree</h2>
              <div className="card" style={{ padding: "48px 24px", background: "var(--gls2)", borderRadius: "var(--br)", border: "1px solid var(--gls-br)", display: "flex", flexDirection: "column", alignItems: "center", gap: "32px", overflowX: "auto" }}>
                <div style={{ padding: "16px 32px", background: "var(--gls)", border: "1px solid var(--gls-br)", borderRadius: "8px", textAlign: "center" }}>
                  <strong>Carloman</strong><br/>
                  <span style={{ fontSize: "0.85rem", color: "var(--fg2)" }}>(Aristocrat in Austrasia)</span>
                </div>
                <div style={{ width: "2px", height: "32px", background: "var(--gls-br)" }} />
                <div style={{ padding: "16px 32px", background: "var(--fg)", color: "var(--bg)", border: "1px solid var(--fg)", borderRadius: "8px", textAlign: "center" }}>
                  <strong>Pippin of Landen</strong><br/>
                  <span style={{ fontSize: "0.85rem", opacity: 0.8 }}>(c. 580 – 640) Mayor of the Palace</span>
                </div>
                <div style={{ display: "flex", gap: "64px" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "32px" }}>
                    <div style={{ width: "2px", height: "32px", background: "var(--gls-br)" }} />
                    <div style={{ padding: "16px 32px", background: "var(--gls)", border: "1px solid var(--gls-br)", borderRadius: "8px", textAlign: "center" }}>
                      <strong>Begga</strong><br/>
                      <span style={{ fontSize: "0.85rem", color: "var(--fg2)" }}>Married Ansegisel (Arnulfing line)</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "32px" }}>
                    <div style={{ width: "2px", height: "32px", background: "var(--gls-br)" }} />
                    <div style={{ padding: "16px 32px", background: "var(--gls)", border: "1px solid var(--gls-br)", borderRadius: "8px", textAlign: "center" }}>
                      <strong>Grimoald the Elder</strong><br/>
                      <span style={{ fontSize: "0.85rem", color: "var(--fg2)" }}>Mayor of the Palace</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 style={{ fontSize: "2rem", marginBottom: "32px", color: "var(--fg)" }}>The Station's History</h2>
              <div style={{ position: "relative", paddingLeft: "32px", maxWidth: "800px", margin: "0 auto" }}>
                <div style={{ position: "absolute", left: "7px", top: 0, bottom: 0, width: "2px", background: "var(--gls-br)" }} />
                
                <div style={{ position: "relative", marginBottom: "48px" }}>
                  <div style={{ position: "absolute", left: "-32px", top: "6px", width: "16px", height: "16px", borderRadius: "50%", background: "var(--fg)", border: "4px solid var(--bg)" }} />
                  <h3 style={{ fontSize: "1.2rem", color: "var(--fg)", marginBottom: "8px" }}>2 April 1838</h3>
                  <p style={{ color: "var(--fg2)", lineHeight: "1.6" }}>Landen railway station officially opens, becoming one of the earliest rail links in the nascent Belgian state, connecting the rural area to wider trade routes.</p>
                </div>

                <div style={{ position: "relative", marginBottom: "48px" }}>
                  <div style={{ position: "absolute", left: "-32px", top: "6px", width: "16px", height: "16px", borderRadius: "50%", background: "var(--fg)", border: "4px solid var(--bg)" }} />
                  <h3 style={{ fontSize: "1.2rem", color: "var(--fg)", marginBottom: "8px" }}>Late 19th Century</h3>
                  <p style={{ color: "var(--fg2)", lineHeight: "1.6" }}>The station evolves into a major regional hub. The influx of railway workers and travelers begins to subtly influence the isolated local dialect, bringing in French and Brabantian loanwords.</p>
                </div>

                <div style={{ position: "relative" }}>
                  <div style={{ position: "absolute", left: "-32px", top: "6px", width: "16px", height: "16px", borderRadius: "50%", background: "var(--fg)", border: "4px solid var(--bg)" }} />
                  <h3 style={{ fontSize: "1.2rem", color: "var(--fg)", marginBottom: "8px" }}>Modern Era</h3>
                  <p style={{ color: "var(--fg2)", lineHeight: "1.6" }}>While many local branch lines closed in the mid-20th century, Landen remains a crucial stop on the main Brussels-Liège line, serving as a gateway between Flanders and Wallonia.</p>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
