import { useState, useEffect } from "react";
import { Nav } from "../components/Nav";
import { CultureAPI } from "../api";
import type { CultureFact, CultureImage, CultureAudio } from "../api";
import { BookOpen, MessageCircle, Hourglass, PlayCircle } from "lucide-react";

type Tab = 'Overzicht' | 'Taalkunde' | 'Geschiedenis';

const timelineData = [
  {
    id: "t1",
    year: "54 v.Chr. – 50 v.Chr.",
    title: "Romeinse Verovering",
    content: "De Gallische Oorlogen brengen Landen in de invloedssfeer van het Romeinse Rijk. De regio wordt blootgesteld aan de Latijnse taal, de administratieve taal van het Rijk, wat het startpunt is voor een eeuwenlange linguïstische frictie in het gebied."
  },
  {
    id: "t2",
    year: "Eerste Eeuwen n.Chr.",
    title: "Aanleg van de Via Belgica",
    content: "De belangrijke Romeinse heerweg tussen Boulogne, Tongeren en Keulen wordt aangelegd en loopt vlak ten noorden van Landen. Deze as fungeert als een katalysator voor Romanisering ten zuiden ervan, terwijl het noorden Germaanser blijft."
  },
  {
    id: "t3",
    year: "c. 350 – 450 n.Chr.",
    title: "Inval van de Salische Franken",
    content: "De Franken steken de Rijn over en vestigen zich in Toxandrië en Haspengouw (waaronder Landen). Ze brengen hun Germaanse dialecten mee, verdringen het Latijn, en leggen de basis voor het latere Frankisch en Oudnederlands."
  },
  {
    id: "t4",
    year: "c. 580 n.Chr.",
    title: "Geboorte Pippijn van Landen",
    content: "Pippijn de Oudere wordt geboren in de regio. Als hofmeier behoort hij tot een aristocratie die Oudopperfrankisch of Oudnederfrankisch spreekt. Deze Frankische adellijke invloed verankert zich diep in de plaatselijke streektalen."
  },
  {
    id: "t5",
    year: "c. 640 n.Chr.",
    title: "De Merovingische Toponymie",
    content: "Na de dood van Pippijn blijft Landen een centrum van Merovingische macht. Deze Germaanse invloed is vandaag nog zichtbaar in de vele toponiemen eindigend op '-ingen' en '-maal' in Haspengouw en het Getelands."
  },
  {
    id: "t6",
    year: "9e Eeuw",
    title: "Karolingische Splitsingen",
    content: "Door het Verdrag van Verdun (843) en Meerssen (870) komt Landen uiteindelijk in Oost-Francië terecht. Dit versterkt de Germaanse politieke en culturele banden, ver weg van de zich vormende Franse staat."
  },
  {
    id: "t7",
    year: "11e Eeuw",
    title: "Stadsrechten onder Brabant",
    content: "Landen krijgt stadsrechten van de Hertog van Brabant. Het Brabantse dialect begint aan zijn eeuwenlange, prestigieuze opmars naar het oosten, waardoor Landen langzaam taalkundige elementen van steden als Leuven overneemt."
  },
  {
    id: "t8",
    year: "1211",
    title: "De Slag bij Steppes",
    content: "Dit militaire conflict tussen het Hertogdom Brabant en het Prinsbisdom Luik vindt plaats nabij Landen. Het illustreert de grensstatus van de stad, geklemd tussen het expanderende Brabantse taalgebied en de oostelijke Limburgs/Luikse invloeden."
  },
  {
    id: "t9",
    year: "13e – 14e Eeuw",
    title: "Brabantse Expansie en Aanspreekvormen",
    content: "De invloed van de Brabantse dialectexpansie bereikt zijn hoogtepunt. Landen neemt Brabantse kenmerken over, met name het gebruik van het persoonlijk voornaamwoord 'gij', in tegenstelling tot de meer oostelijke vormen."
  },
  {
    id: "t10",
    year: "14e Eeuw",
    title: "Stabilisatie Uerdingerlinie",
    content: "De isoglosse die de westelijke 'ik'-vorm scheidt van de oostelijke 'ich'-vorm stabiliseert zich. Landen belandt exact aan de oostzijde ('ich'), wat het bepalende kernmerk wordt voor het unieke Getelandse dialect."
  },
  {
    id: "t11",
    year: "1648",
    title: "De Vrede van Münster",
    content: "De formele grens met de Republiek wordt vastgelegd. De noordelijke dialecten isoleren zich, waardoor de zuidelijke dialecten (zoals het Getelands) zich zelfstandig verder ontwikkelen zonder druk van de opkomende noordelijke standaardtaal."
  },
  {
    id: "t12",
    year: "1795",
    title: "Franse Annexatie",
    content: "De Franse Republiek annexeert de regio en maakt het Frans de enige toegelaten bestuurstaal. Ondanks de verfransing van het openbare leven en de elite, blijft de plattelandsbevolking in Landen hardnekkig vasthouden aan het dialect."
  },
  {
    id: "t13",
    year: "1815 – 1830",
    title: "Verenigd Koninkrijk der Nederlanden",
    content: "Koning Willem I doet een poging om het Nederlands weer als officiële staatstaal in het zuiden te implementeren. De korte duur van deze periode heeft echter weinig invloed op de diepgewortelde structuur van het Landense dialect."
  },
  {
    id: "t14",
    year: "1830",
    title: "Belgische Onafhankelijkheid",
    content: "De Belgische staat wordt opgericht met Frans als exclusieve voertaal van de overheid. Het Getelandse dialect blijft geïsoleerd functioneren als de gesproken volkstaal, verstoken van enige standaardisering."
  },
  {
    id: "t15",
    year: "2 April 1838",
    title: "Opening Spoorlijn 36",
    content: "Het station van Landen opent op de hoofdas Brussel-Luik. De spoorweg doorbreekt het linguïstisch isolement en introduceert honderden Franse (waalse) spoorwegtermen direct in de volkstaal van Landen."
  },
  {
    id: "t16",
    year: "1846",
    title: "Eerste Officiële Talentelling",
    content: "De eerste algemene talentelling in België vindt plaats. In grensgebieden zoals Landen waren deze resultaten vaak onbetrouwbaar en onderwerp van politieke spanningen, wat de taalgrens op scherp stelde."
  },
  {
    id: "t17",
    year: "21 Juli 1890",
    title: "De Gelijkheidswet",
    content: "Na decennia van Franse suprematie zorgt deze wet ervoor dat het Nederlands (waaronder ook het dialect) officieel voor de rechtbank gebruikt mag worden in Vlaanderen, een trage formele erkenning van de streektaal."
  },
  {
    id: "t18",
    year: "1921",
    title: "Eerste Taalwet in Bestuurszaken",
    content: "België wordt administratief opgedeeld in eentalige en tweetalige gebieden. Het territorialiteitsbeginsel wordt geïntroduceerd, maar de grens rond Landen blijft nog fluïde en afhankelijk van de talentellingen."
  },
  {
    id: "t19",
    year: "1932",
    title: "Verankering Territorialiteitsbeginsel",
    content: "De wet stipuleert dat de taal van de administratie de taal van de meerderheid is, wat gemeten wordt via de omstreden tienjaarlijkse volkstellingen die grote paniek in de taalgrensgemeenten veroorzaken."
  },
  {
    id: "t20",
    year: "1947",
    title: "De Laatste Talentelling",
    content: "De laatste en fel betwiste talentelling vindt plaats onder enorme politieke druk en vervalsing in grensgebieden. Vlaamse burgemeesters, waaronder in de streek van Landen, weigeren nog mee te werken aan verdere tellingen."
  },
  {
    id: "t21",
    year: "8 November 1962",
    title: "Fixatie van de Taalgrens (Wet-Gilson)",
    content: "De taalgrens wordt definitief in de wet verankerd, ongeacht verdere tellingen. Landen wordt onherroepelijk bij het eentalig Nederlandstalige Brabant (nu Vlaams-Brabant) gevoegd, waardoor duizenden jaren van taalevolutie in steen gebeiteld worden."
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
    <div className="pg" style={{ display: "flex", flexDirection: "column", flex: 1, padding: "24px", paddingBottom: "100px", overflowX: "hidden" }}>
      <div className="bg-orb bg-orb--a" />
      <div className="bg-orb bg-orb--b" />
      <div className="bg-orb bg-orb--c" />
      
      <div style={{ zIndex: 10 }}>
        <Nav />
      </div>
      
      <main className="search-main" style={{ maxWidth: "1200px", margin: "0 auto", width: "100%", marginTop: "24px" }}>
        
        <div className="nav-wrap" style={{ marginBottom: "24px", display: "flex", justifyContent: "center" }}>
          <div className="nav-pill" style={{ display: "flex" }}>
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

            <div style={{ marginBottom: "100px", width: "100vw", position: "relative", left: "50%", right: "50%", marginLeft: "-50vw", marginRight: "-50vw", overflow: "hidden" }}>
              <div style={{ textAlign: "center", marginBottom: "24px" }}>
                <h3 style={{ color: "var(--fg2)", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Chronologie van de Taalgrens in Landen</h3>
              </div>
              
              <div style={{ overflowX: "auto", position: "relative", padding: "0 100px" }}>
                <div style={{ position: "relative", height: "600px", display: "flex", alignItems: "center", minWidth: "max-content", gap: "250px" }}>
                  <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: "2px", background: "var(--ac)" }} />
                  
                  {timelineData.map((item, index) => {
                    const isTop = index % 2 === 0;
                    return (
                      <div key={item.id} style={{ position: "relative", width: "40px" }}>
                        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "16px", height: "16px", borderRadius: "50%", background: "var(--bg)", border: "3px solid var(--ac)", boxShadow: "0 0 10px rgba(239, 51, 64, 0.5)", zIndex: 2 }} />
                        
                        <div 
                          style={{ 
                            position: "absolute", 
                            [isTop ? "bottom" : "top"]: "calc(50% + 16px)", 
                            left: "50%", 
                            transform: "translateX(-50%)", 
                            width: "320px", 
                            padding: "16px",
                            cursor: "pointer",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center"
                          }} 
                          onClick={() => setExpandedTimelineId(expandedTimelineId === item.id ? null : item.id)}
                        >
                           <div style={{ position: "absolute", [isTop ? "bottom" : "top"]: "-16px", left: "50%", width: "1px", height: "16px", background: "var(--ac)" }} />

                           <div style={{ color: "var(--ac)", fontWeight: 700, fontSize: "1.1rem", marginBottom: "8px", letterSpacing: "0.05em", textAlign: "center" }}>{item.year}</div>
                           <h4 style={{ color: "var(--fg)", fontSize: "1.1rem", fontWeight: 600, margin: 0, textAlign: "center", lineHeight: "1.4" }}>{item.title}</h4>
                           
                           <div style={{ height: expandedTimelineId === item.id ? "180px" : "0px", overflow: "hidden", transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)", width: "100%", opacity: expandedTimelineId === item.id ? 1 : 0 }}>
                             <div style={{ marginTop: "16px", background: "var(--gls)", padding: "16px", borderRadius: "var(--br-sm)", border: "1px solid var(--gls-br)", color: "var(--fg2)", fontSize: "0.95rem", lineHeight: "1.6", textAlign: "left", boxShadow: "var(--sh)" }}>
                               {item.content}
                             </div>
                           </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: "center", color: "var(--fg2)" }}>Gegevens worden geladen...</div>
            ) : (
              <div className="masonry-grid" style={{ 
                columnCount: 2, 
                columnGap: "48px",
                maxWidth: "1000px",
                margin: "0 auto"
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
          <section style={{ animation: "fade-in 0.5s ease", maxWidth: "1000px", margin: "0 auto" }}>
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
          <section style={{ animation: "fade-in 0.5s ease", maxWidth: "1000px", margin: "0 auto" }}>
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
