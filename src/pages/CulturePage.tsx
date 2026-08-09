import { useState, useEffect } from "react";
import { Nav } from "../components/Nav";
import { CultureAPI } from "../api";
import type { CultureFact, CultureImage, CultureAudio } from "../api";
import { BookOpen, MessageCircle, Hourglass, PlayCircle, ChevronDown, ChevronUp } from "lucide-react";

type Tab = 'Overzicht' | 'Taalkunde' | 'Geschiedenis';

const timelineData = [
  {
    id: "t1",
    year: "c. 50 v.Chr. – 400 n.Chr.",
    title: "De Via Belgica en de Romeinse Invloed",
    content: "De Romeinse heerweg tussen Boulogne en Keulen loopt vlak ten noorden van Landen. De noordelijke regio behield sterke Germaanse invloeden, terwijl het zuiden geromaniseerd werd. Dit legde de fundering voor de latere taalgrens."
  },
  {
    id: "t2",
    year: "c. 250 – 500 n.Chr.",
    title: "De Frankische Kolonisatie",
    content: "Salische Franken steken de Rijn over en vestigen zich in de regio. Het Frankisch verdringt het Latijn volledig ten noorden van de kolenwouden (Silva Carbonaria), wat leidt tot het ontstaan van het Oudnederlands in deze streek."
  },
  {
    id: "t3",
    year: "c. 580 – 640 n.Chr.",
    title: "Pippijn van Landen",
    content: "Als hofmeier van Austrasië spreekt Pippijn van Landen Oudopperfrankisch of Oudnederfrankisch. Het bestuurlijke machtscentrum zorgt voor een diepe integratie van Frankische woordenschat in de lokale taal."
  },
  {
    id: "t4",
    year: "11e – 14e Eeuw",
    title: "De Brabantse Expansie",
    content: "Landen ligt op de grens van het machtige Hertogdom Brabant en het Prinsbisdom Luik. De oostwaartse Brabantse expansie beïnvloedt de taal, maar door de perifere ligging behoudt Landen conservatieve kenmerken."
  },
  {
    id: "t5",
    year: "13e Eeuw – Heden",
    title: "Vorming van het Getelands",
    content: "De Uerdingerlinie (de grens tussen 'ik' en 'ich') stabiliseert zich. Landen ontwikkelt het 'Getelands', een uniek overgangsdialect met Brabantse kenmerken (zoals het gebruik van 'gij') en Limburgse invloeden (zoals umlaut in verkleinwoorden)."
  },
  {
    id: "t6",
    year: "1962",
    title: "Fixatie van de Taalgrens",
    content: "De wettelijke vastlegging van de taalgrens verankert Landen definitief in het eentalig Nederlandstalig gebied (Vlaams-Brabant), grenzend aan het Franstalige Waals-Brabant en Luik."
  }
];

export const CulturePage = () => {
  const [activeTab, setActiveTab] = useState<Tab>('Overzicht');
  const [facts, setFacts] = useState<CultureFact[]>([]);
  const [images, setImages] = useState<CultureImage[]>([]);
  const [audios, setAudios] = useState<CultureAudio[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedTimelineId, setExpandedTimelineId] = useState<string | null>(null);

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
        
        <div className="nav-wrap" style={{ marginBottom: "32px" }}>
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
            <div style={{ textAlign: "center", marginBottom: "64px", position: "relative" }}>
              <h2 style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: "16px", color: "var(--fg)", letterSpacing: "-0.02em" }}>
                Oorsprong en Taal
              </h2>
              <p style={{ color: "var(--fg2)", maxWidth: "800px", margin: "0 auto", lineHeight: "1.9", fontSize: "1.1rem", fontWeight: 400 }}>
                Landen bevindt zich op een cruciaal historisch breukvlak. De stad vormt een taalkundige en geografische brug waar Frankische nederzettingen, Brabantse expansie en de Romeinse erfenis samenkwamen om een uniek grensgebied te vormen, onlosmakelijk verbonden met het ontstaan van de taalgrens.
              </p>
            </div>

            <div style={{ marginBottom: "80px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
                <div style={{ flex: 1, height: "1px", background: "var(--gls-br)" }} />
                <h3 style={{ color: "var(--fg2)", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Tijdlijn van de Landense Taal</h3>
                <div style={{ flex: 1, height: "1px", background: "var(--gls-br)" }} />
              </div>
              
              <div style={{ display: "flex", overflowX: "auto", gap: "16px", paddingBottom: "24px", msOverflowStyle: "none", scrollbarWidth: "none" }}>
                {timelineData.map((item) => (
                  <div 
                    key={item.id} 
                    style={{ 
                      minWidth: "300px", 
                      flex: "0 0 auto", 
                      background: expandedTimelineId === item.id ? "var(--gls2)" : "var(--gls)", 
                      border: "1px solid var(--gls-br)", 
                      borderRadius: "var(--br-sm)", 
                      padding: "20px", 
                      cursor: "pointer", 
                      transition: "all 0.3s ease",
                      borderTop: expandedTimelineId === item.id ? "2px solid var(--ac)" : "1px solid var(--gls-br)"
                    }}
                    onClick={() => setExpandedTimelineId(expandedTimelineId === item.id ? null : item.id)}
                  >
                    <div style={{ color: "var(--ac)", fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.05em", marginBottom: "8px" }}>{item.year}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <h4 style={{ color: "var(--fg)", fontSize: "1.1rem", fontWeight: 500, margin: 0 }}>{item.title}</h4>
                      {expandedTimelineId === item.id ? <ChevronUp size={18} color="var(--fg2)" /> : <ChevronDown size={18} color="var(--fg2)" />}
                    </div>
                    {expandedTimelineId === item.id && (
                      <p style={{ marginTop: "16px", color: "var(--fg2)", fontSize: "0.95rem", lineHeight: "1.6", animation: "fade-in 0.3s ease" }}>
                        {item.content}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: "center", color: "var(--fg2)" }}>Gegevens worden geladen...</div>
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
              </div>
            )}
          </section>
        )}

        {activeTab === 'Taalkunde' && (
          <section style={{ animation: "fade-in 0.5s ease" }}>
            <div style={{ marginBottom: "100px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "center" }}>
              <div>
                <h2 style={{ fontSize: "2.25rem", fontWeight: 700, marginBottom: "32px", color: "var(--fg)", letterSpacing: "-0.02em" }}>
                  Het Getelands en de<br/><span style={{ color: "var(--ac)" }}>Uerdingerlinie</span>
                </h2>
                <div style={{ width: "40px", height: "2px", background: "var(--gls-br2)", marginBottom: "32px" }} />
                <p style={{ color: "var(--fg)", lineHeight: "1.9", fontSize: "1.1rem", marginBottom: "24px", opacity: 0.9 }}>
                  Het dialect van Landen behoort tot het <strong>Getelands</strong>, een uniek overgangsdialect dat precies op het breukvlak van het Brabants en het Limburgs ligt.
                </p>
                <p style={{ color: "var(--fg2)", lineHeight: "1.9", fontSize: "1.1rem" }}>
                  De stad bevindt zich onmiddellijk aan de <em>Uerdingerlinie</em>. Dit is de fonologische isoglosse die het gebruik van <em>"ik"</em> (noord/west) scheidt van <em>"ich"</em> (zuid/oost). In het traditionele Landense dialect gebruikt men de Limburgse vorm "ich", gecombineerd met de typisch Brabantse aanspreekvorm "gij". Bovendien worden verkleinwoorden vaak met een umlaut gevormd, zoals in <em>ménneke</em>.
                </p>
              </div>
              <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                 <div style={{ fontSize: "5rem", fontWeight: 200, color: "var(--gls-br2)", fontFamily: "serif", display: "flex", alignItems: "center", gap: "24px", userSelect: "none" }}>
                    <span>ik</span>
                    <span style={{ fontSize: "2rem", color: "var(--ac)" }}>↔</span>
                    <span style={{ color: "var(--fg)" }}>ich</span>
                 </div>
              </div>
            </div>

            <div>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 600, marginBottom: "40px", color: "var(--fg)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Geluidsarchief Dialect
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
                        <span style={{ color: "var(--fg)", fontSize: "1.1rem", letterSpacing: "0.01em", fontStyle: "italic" }}>"Ich zen van Londe."</span>
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
              <h2 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "64px", color: "var(--fg)", textAlign: "center", letterSpacing: "-0.02em" }}>De Merovingische Stamboom</h2>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                
                <div style={{ textAlign: "center" }}>
                  <h3 style={{ fontSize: "1.25rem", color: "var(--fg)", fontWeight: 500, letterSpacing: "0.05em" }}>Carloman</h3>
                  <span style={{ fontSize: "0.85rem", color: "var(--fg2)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Aristocraat in Austrasië</span>
                </div>
                
                <div style={{ width: "1px", height: "48px", background: "linear-gradient(to bottom, var(--gls-br2), var(--ac))", margin: "16px 0" }} />
                
                <div style={{ textAlign: "center" }}>
                  <h3 style={{ fontSize: "1.5rem", color: "var(--ac)", fontWeight: 600, letterSpacing: "0.05em" }}>Pippijn van Landen</h3>
                  <span style={{ fontSize: "0.85rem", color: "var(--fg)", textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.8 }}>(c. 580 – 640) Hofmeier</span>
                </div>

                <div style={{ position: "relative", width: "240px", height: "48px", margin: "16px 0" }}>
                   <div style={{ position: "absolute", left: "50%", top: 0, width: "1px", height: "24px", background: "var(--ac)" }} />
                   <div style={{ position: "absolute", left: 0, right: 0, top: "24px", height: "1px", background: "linear-gradient(to right, var(--gls-br2), var(--ac) 50%, var(--gls-br2))" }} />
                   <div style={{ position: "absolute", left: 0, top: "24px", width: "1px", height: "24px", background: "var(--gls-br2)" }} />
                   <div style={{ position: "absolute", right: 0, top: "24px", width: "1px", height: "24px", background: "var(--gls-br2)" }} />
                </div>
                
                <div style={{ display: "flex", justifySelf: "stretch", justifyContent: "space-between", width: "400px" }}>
                  <div style={{ textAlign: "center", width: "160px" }}>
                    <h3 style={{ fontSize: "1.1rem", color: "var(--fg)", fontWeight: 500, letterSpacing: "0.05em" }}>Begga</h3>
                    <span style={{ fontSize: "0.8rem", color: "var(--fg2)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Huwde Ansegisus<br/>(Arnulfingers)</span>
                  </div>
                  <div style={{ textAlign: "center", width: "160px" }}>
                    <h3 style={{ fontSize: "1.1rem", color: "var(--fg)", fontWeight: 500, letterSpacing: "0.05em" }}>Grimoald I</h3>
                    <span style={{ fontSize: "0.8rem", color: "var(--fg2)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Hofmeier</span>
                  </div>
                </div>

              </div>
            </div>

            <div>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "48px", color: "var(--fg)", letterSpacing: "0.05em", textTransform: "uppercase" }}>Tijdlijn van het Station</h2>
              <div style={{ position: "relative", paddingLeft: "48px", maxWidth: "800px" }}>
                <div style={{ position: "absolute", left: "7px", top: "12px", bottom: "24px", width: "1px", background: "var(--gls-br)" }} />
                
                <div style={{ position: "relative", marginBottom: "64px" }}>
                  <div style={{ position: "absolute", left: "-44px", top: "8px", width: "8px", height: "8px", borderRadius: "50%", background: "var(--bg)", border: "1px solid var(--ac)", boxShadow: "0 0 10px rgba(239, 51, 64, 0.4)" }} />
                  <h3 style={{ fontSize: "1.25rem", color: "var(--fg)", marginBottom: "12px", fontWeight: 500 }}>2 April 1838</h3>
                  <p style={{ color: "var(--fg2)", lineHeight: "1.8", fontSize: "1.05rem" }}>Station Landen opent officieel, wat het een van de vroegste spoorverbindingen in de prille Belgische staat maakt en het platteland verbindt met de bredere handelsroutes.</p>
                </div>

                <div style={{ position: "relative", marginBottom: "64px" }}>
                  <div style={{ position: "absolute", left: "-44px", top: "8px", width: "8px", height: "8px", borderRadius: "50%", background: "var(--bg)", border: "1px solid var(--fg2)" }} />
                  <h3 style={{ fontSize: "1.25rem", color: "var(--fg)", marginBottom: "12px", fontWeight: 500 }}>Eind 19e Eeuw</h3>
                  <p style={{ color: "var(--fg2)", lineHeight: "1.8", fontSize: "1.05rem" }}>Het station evolueert tot een belangrijk regionaal knooppunt. De toestroom van spoorwegarbeiders en reizigers begint het geïsoleerde lokale dialect subtiel te beïnvloeden met Franse en Brabantse leenwoorden.</p>
                </div>

                <div style={{ position: "relative" }}>
                  <div style={{ position: "absolute", left: "-44px", top: "8px", width: "8px", height: "8px", borderRadius: "50%", background: "var(--bg)", border: "1px solid var(--fg2)" }} />
                  <h3 style={{ fontSize: "1.25rem", color: "var(--fg)", marginBottom: "12px", fontWeight: 500 }}>Moderne Tijd</h3>
                  <p style={{ color: "var(--fg2)", lineHeight: "1.8", fontSize: "1.05rem" }}>Hoewel veel lokale aftakkingen in het midden van de 20e eeuw sloten, blijft Landen een cruciale stop op de hoofdlijn Brussel-Luik, als poort tussen Vlaanderen en Wallonië.</p>
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
