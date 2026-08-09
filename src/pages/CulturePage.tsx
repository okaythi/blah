import { useState, useEffect } from "react";
import { Nav } from "../components/Nav";
import { CultureAPI } from "../api";
import type { CultureFact, CultureImage, CultureAudio } from "../api";
import { BookOpen, MessageCircle, Hourglass, PlayCircle } from "lucide-react";

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
    <div className="pg" style={{ display: "flex", flexDirection: "column", flex: 1, padding: "24px", paddingBottom: "100px" }}>
      <div className="bg-orb bg-orb--a" />
      <div className="bg-orb bg-orb--b" />
      <div className="bg-orb bg-orb--c" />
      
      <div style={{ zIndex: 10 }}>
        <Nav />
      </div>
      
      <main className="search-main" style={{ maxWidth: "1000px", margin: "0 auto", width: "100%", marginTop: "24px" }}>
        
        {/* Sub-Pills Navigation matching Nav.tsx */}
        <div className="nav-wrap" style={{ marginBottom: "64px" }}>
          <div className="nav-pill">
            <button
              onClick={() => setActiveTab('Overzicht')}
              className={`nav-item ${activeTab === 'Overzicht' ? 'nav-item--active' : ''}`}
              style={{ background: activeTab === 'Overzicht' ? "" : "transparent", border: "none", cursor: "pointer", fontFamily: "inherit" }}
            >
              <BookOpen size={16} />
              <span>Overzicht</span>
            </button>
            <button
              onClick={() => setActiveTab('Taalkunde')}
              className={`nav-item ${activeTab === 'Taalkunde' ? 'nav-item--active' : ''}`}
              style={{ background: activeTab === 'Taalkunde' ? "" : "transparent", border: "none", cursor: "pointer", fontFamily: "inherit" }}
            >
              <MessageCircle size={16} />
              <span>Taalkunde</span>
            </button>
            <button
              onClick={() => setActiveTab('Geschiedenis')}
              className={`nav-item ${activeTab === 'Geschiedenis' ? 'nav-item--active' : ''}`}
              style={{ background: activeTab === 'Geschiedenis' ? "" : "transparent", border: "none", cursor: "pointer", fontFamily: "inherit" }}
            >
              <Hourglass size={16} />
              <span>Geschiedenis</span>
            </button>
          </div>
        </div>

        {activeTab === 'Overzicht' && (
          <section style={{ animation: "fade-in 0.5s ease" }}>
            <div style={{ textAlign: "center", marginBottom: "80px", position: "relative" }}>
              <h2 style={{ fontSize: "2.75rem", fontWeight: 700, marginBottom: "24px", color: "var(--fg)", letterSpacing: "-0.02em" }}>
                The Merovingian Legacy
              </h2>
              <p style={{ color: "var(--fg2)", maxWidth: "700px", margin: "0 auto", lineHeight: "1.9", fontSize: "1.15rem", fontWeight: 400 }}>
                Pippin of Landen (c. 580 – 640), also known as Pippin the Elder, was the Mayor of the Palace of Austrasia under the Merovingian kings. Though not a king himself, he wielded immense power, effectively ruling the kingdom behind the scenes. His lineage founded the dynasty that would eventually displace the Merovingians entirely, forever tying Landen's soil to the birth of the Carolingian empire.
              </p>
              <div style={{ width: "1px", height: "60px", background: "linear-gradient(to bottom, var(--gls-br), transparent)", margin: "40px auto 0" }} />
            </div>

            {loading ? (
              <div style={{ textAlign: "center", color: "var(--fg2)" }}>Laden...</div>
            ) : (
              <div className="masonry-grid" style={{ 
                columnCount: 2, 
                columnGap: "48px" 
              }}>
                {facts.map(fact => (
                  <div key={fact.id} className="masonry-item" style={{ breakInside: "avoid", marginBottom: "64px" }}>
                    <blockquote style={{ 
                      fontSize: "1.3rem", 
                      lineHeight: "1.7", 
                      color: "var(--fg)", 
                      borderLeft: "2px solid var(--ac)", 
                      paddingLeft: "24px",
                      margin: 0,
                      fontStyle: "italic",
                      opacity: 0.9
                    }}>
                      "{fact.fact}"
                    </blockquote>
                  </div>
                ))}
                {images.map(img => (
                  <div key={img.id} className="masonry-item" style={{ breakInside: "avoid", marginBottom: "64px" }}>
                    <img src={img.image_url} alt={img.caption || ""} style={{ width: "100%", display: "block", borderRadius: "var(--br-sm)", filter: "grayscale(100%) contrast(1.1)", opacity: 0.85, transition: "all 0.3s ease", cursor: "pointer" }} onMouseOver={e => { e.currentTarget.style.filter = "grayscale(0%) contrast(1.1)"; e.currentTarget.style.opacity = "1"; }} onMouseOut={e => { e.currentTarget.style.filter = "grayscale(100%) contrast(1.1)"; e.currentTarget.style.opacity = "0.85"; }} />
                    {img.caption && (
                      <p style={{ marginTop: "16px", fontSize: "0.9rem", color: "var(--fg2)", letterSpacing: "0.01em" }}>
                        {img.caption}
                      </p>
                    )}
                  </div>
                ))}
                {images.length === 0 && (
                   <div className="masonry-item" style={{ breakInside: "avoid", marginBottom: "64px" }}>
                      <div style={{ width: "100%", height: "400px", borderRadius: "var(--br-sm)", background: "var(--gls)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--fg2)", opacity: 0.5 }}>
                        Placeholder: Mood Image
                      </div>
                      <p style={{ marginTop: "16px", fontSize: "0.9rem", color: "var(--fg2)", letterSpacing: "0.01em" }}>
                        Cobblestone streets of historical Landen.
                      </p>
                   </div>
                )}
              </div>
            )}
          </section>
        )}

        {activeTab === 'Taalkunde' && (
          <section style={{ animation: "fade-in 0.5s ease" }}>
            <div style={{ marginBottom: "100px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "center" }}>
              <div>
                <h2 style={{ fontSize: "2.25rem", fontWeight: 700, marginBottom: "32px", color: "var(--fg)", letterSpacing: "-0.02em" }}>
                  The Ingvaeonic<br/><span style={{ color: "var(--ac)" }}>Influence</span>
                </h2>
                <div style={{ width: "40px", height: "2px", background: "var(--gls-br2)", marginBottom: "32px" }} />
                <p style={{ color: "var(--fg)", lineHeight: "1.9", fontSize: "1.1rem", marginBottom: "24px", opacity: 0.9 }}>
                  The local dialect of Landen is fascinatingly shaped by historical linguistic shifts, most notably the <strong>Ingvaeonic nasal spirant law</strong>. This phonological development occurred in languages around the North Sea, but its echoes reached inland.
                </p>
                <p style={{ color: "var(--fg2)", lineHeight: "1.9", fontSize: "1.1rem" }}>
                  It caused the loss of nasal consonants ('n' or 'm') before fricatives ('f', 's', 'th'). This is precisely why we say <em>"vijf"</em> (five) and <em>"zacht"</em> (soft), contrasting with German forms that retained the nasal like <em>"fünf"</em> and <em>"sanft"</em>.
                </p>
              </div>
              <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                 <div style={{ fontSize: "5rem", fontWeight: 200, color: "var(--gls-br2)", fontFamily: "serif", display: "flex", alignItems: "center", gap: "24px", userSelect: "none" }}>
                    <span>fünf</span>
                    <span style={{ fontSize: "2rem", color: "var(--ac)" }}>→</span>
                    <span style={{ color: "var(--fg)" }}>vijf</span>
                 </div>
              </div>
            </div>

            <div>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 600, marginBottom: "40px", color: "var(--fg)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Native Speaker Archive
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                {audios.length > 0 ? audios.map(audio => (
                  <div key={audio.id} style={{ display: "flex", alignItems: "center", gap: "32px", padding: "16px 0", borderBottom: "1px solid var(--gls-br)" }}>
                    <button style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--ac)", flexShrink: 0, padding: 0, display: "flex" }}>
                      <PlayCircle size={40} strokeWidth={1.5} />
                    </button>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "12px" }}>
                      <div style={{ height: "2px", background: "var(--gls-br)", width: "100%", position: "relative" }}>
                        <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: "0%", background: "var(--ac)", boxShadow: "0 0 10px var(--ac)" }} />
                      </div>
                      {audio.caption && <span style={{ color: "var(--fg)", fontSize: "1rem", letterSpacing: "0.02em" }}>{audio.caption}</span>}
                    </div>
                  </div>
                )) : (
                  <>
                    <div style={{ display: "flex", alignItems: "center", gap: "32px", padding: "16px 0", borderBottom: "1px solid var(--gls-br)" }}>
                      <button style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--fg2)", flexShrink: 0, padding: 0, display: "flex", transition: "color 0.2s ease" }} onMouseOver={e => e.currentTarget.style.color = "var(--ac)"} onMouseOut={e => e.currentTarget.style.color = "var(--fg2)"}>
                        <PlayCircle size={40} strokeWidth={1.5} />
                      </button>
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px" }}>
                        <div style={{ height: "2px", background: "var(--gls-br)", width: "100%" }} />
                        <span style={{ color: "var(--fg)", fontSize: "1.1rem", letterSpacing: "0.01em", fontStyle: "italic" }}>"T is beter blô gebleve as groen geschete."</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "32px", padding: "16px 0", borderBottom: "1px solid var(--gls-br)" }}>
                      <button style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--fg2)", flexShrink: 0, padding: 0, display: "flex", transition: "color 0.2s ease" }} onMouseOver={e => e.currentTarget.style.color = "var(--ac)"} onMouseOut={e => e.currentTarget.style.color = "var(--fg2)"}>
                        <PlayCircle size={40} strokeWidth={1.5} />
                      </button>
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px" }}>
                        <div style={{ height: "2px", background: "var(--gls-br)", width: "100%" }} />
                        <span style={{ color: "var(--fg)", fontSize: "1.1rem", letterSpacing: "0.01em", fontStyle: "italic" }}>"Haa de kak mor in aa broek."</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>
        )}

        {activeTab === 'Geschiedenis' && (
          <section style={{ animation: "fade-in 0.5s ease" }}>
            <div style={{ marginBottom: "120px" }}>
              <h2 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "64px", color: "var(--fg)", textAlign: "center", letterSpacing: "-0.02em" }}>Ancestry of Pippin</h2>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                
                <div style={{ textAlign: "center" }}>
                  <h3 style={{ fontSize: "1.25rem", color: "var(--fg)", fontWeight: 500, letterSpacing: "0.05em" }}>Carloman</h3>
                  <span style={{ fontSize: "0.85rem", color: "var(--fg2)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Aristocrat in Austrasia</span>
                </div>
                
                <div style={{ width: "1px", height: "48px", background: "linear-gradient(to bottom, var(--gls-br2), var(--ac))", margin: "16px 0" }} />
                
                <div style={{ textAlign: "center" }}>
                  <h3 style={{ fontSize: "1.5rem", color: "var(--ac)", fontWeight: 600, letterSpacing: "0.05em" }}>Pippin of Landen</h3>
                  <span style={{ fontSize: "0.85rem", color: "var(--fg)", textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.8 }}>(c. 580 – 640) Mayor of the Palace</span>
                </div>

                <div style={{ position: "relative", width: "240px", height: "48px", margin: "16px 0" }}>
                   {/* Vertical line down from Pippin */}
                   <div style={{ position: "absolute", left: "50%", top: 0, width: "1px", height: "24px", background: "var(--ac)" }} />
                   {/* Horizontal branching line */}
                   <div style={{ position: "absolute", left: 0, right: 0, top: "24px", height: "1px", background: "linear-gradient(to right, var(--gls-br2), var(--ac) 50%, var(--gls-br2))" }} />
                   {/* Vertical lines down to children */}
                   <div style={{ position: "absolute", left: 0, top: "24px", width: "1px", height: "24px", background: "var(--gls-br2)" }} />
                   <div style={{ position: "absolute", right: 0, top: "24px", width: "1px", height: "24px", background: "var(--gls-br2)" }} />
                </div>
                
                <div style={{ display: "flex", justifySelf: "stretch", justifyContent: "space-between", width: "400px" }}>
                  <div style={{ textAlign: "center", width: "160px" }}>
                    <h3 style={{ fontSize: "1.1rem", color: "var(--fg)", fontWeight: 500, letterSpacing: "0.05em" }}>Begga</h3>
                    <span style={{ fontSize: "0.8rem", color: "var(--fg2)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Married Ansegisel<br/>(Arnulfing line)</span>
                  </div>
                  <div style={{ textAlign: "center", width: "160px" }}>
                    <h3 style={{ fontSize: "1.1rem", color: "var(--fg)", fontWeight: 500, letterSpacing: "0.05em" }}>Grimoald the Elder</h3>
                    <span style={{ fontSize: "0.8rem", color: "var(--fg2)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Mayor of the Palace</span>
                  </div>
                </div>

              </div>
            </div>

            <div>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "48px", color: "var(--fg)", letterSpacing: "0.05em", textTransform: "uppercase" }}>The Station's Timeline</h2>
              <div style={{ position: "relative", paddingLeft: "48px", maxWidth: "800px" }}>
                <div style={{ position: "absolute", left: "7px", top: "12px", bottom: "24px", width: "1px", background: "var(--gls-br)" }} />
                
                <div style={{ position: "relative", marginBottom: "64px" }}>
                  <div style={{ position: "absolute", left: "-44px", top: "8px", width: "8px", height: "8px", borderRadius: "50%", background: "var(--bg)", border: "1px solid var(--ac)", boxShadow: "0 0 10px rgba(239, 51, 64, 0.4)" }} />
                  <h3 style={{ fontSize: "1.25rem", color: "var(--fg)", marginBottom: "12px", fontWeight: 500 }}>2 April 1838</h3>
                  <p style={{ color: "var(--fg2)", lineHeight: "1.8", fontSize: "1.05rem" }}>Landen railway station officially opens, becoming one of the earliest rail links in the nascent Belgian state, connecting the rural area to wider trade routes.</p>
                </div>

                <div style={{ position: "relative", marginBottom: "64px" }}>
                  <div style={{ position: "absolute", left: "-44px", top: "8px", width: "8px", height: "8px", borderRadius: "50%", background: "var(--bg)", border: "1px solid var(--fg2)" }} />
                  <h3 style={{ fontSize: "1.25rem", color: "var(--fg)", marginBottom: "12px", fontWeight: 500 }}>Late 19th Century</h3>
                  <p style={{ color: "var(--fg2)", lineHeight: "1.8", fontSize: "1.05rem" }}>The station evolves into a major regional hub. The influx of railway workers and travelers begins to subtly influence the isolated local dialect, bringing in French and Brabantian loanwords.</p>
                </div>

                <div style={{ position: "relative" }}>
                  <div style={{ position: "absolute", left: "-44px", top: "8px", width: "8px", height: "8px", borderRadius: "50%", background: "var(--bg)", border: "1px solid var(--fg2)" }} />
                  <h3 style={{ fontSize: "1.25rem", color: "var(--fg)", marginBottom: "12px", fontWeight: 500 }}>Modern Era</h3>
                  <p style={{ color: "var(--fg2)", lineHeight: "1.8", fontSize: "1.05rem" }}>While many local branch lines closed in the mid-20th century, Landen remains a crucial stop on the main Brussels-Liège line, serving as a gateway between Flanders and Wallonia.</p>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
