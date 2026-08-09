import { useState, useEffect } from "react";
import { startRegistration, startAuthentication } from "@simplewebauthn/browser";
import type { PublicKeyCredentialCreationOptionsJSON, PublicKeyCredentialRequestOptionsJSON } from "@simplewebauthn/browser";
import { LogOut, BookOpen, Edit2, Trash2, Plus } from "lucide-react";
import type { Entry } from "../types";
import { parseEntry, POS_SHORT, STS_L } from "../types";
import { EF } from "../features/admin/components/EF";
import { AdminAPI } from "../api";
import type { AuthRes } from "../api";

export const A = () => {
  const [ca, sca] = useState(false);
  const [u, su] = useState("");
  const [p, sp] = useState("");
  const [sid, ssid] = useState(localStorage.getItem("sid") || "");
  const [err, serr] = useState("");
  const [ld, sld] = useState(false);

  useEffect(() => {
    (AdminAPI.auth({ act: "chk" }) as Promise<Response>)
      .then((r) => r.json())
      .then((d: AuthRes) => { if (d.c === 0) sca(true); })
      .catch(() => {});
  }, []);

  const dolog = async (act: string) => {
    try {
      serr("");
      sld(true);
      const r = await AdminAPI.auth({ act, u, p }) as Response;
      if (!r.ok) { serr("Ongeldige inloggegevens."); sld(false); return; }
      const d: AuthRes = await r.json();

      if (act === "reg_i") {
        if (!d.opts) return;
        const v = await startRegistration({ optionsJSON: d.opts as unknown as PublicKeyCredentialCreationOptionsJSON });
        const vR = await AdminAPI.auth({ act: "reg_v", id: d.id, u, p, c: d.opts?.challenge, resp: v }) as Response;
        if (!vR.ok) { serr("Verificatie van registratie mislukt."); sld(false); return; }
        const vD: AuthRes = await vR.json();
        if (vD.sid) { localStorage.setItem("sid", vD.sid); ssid(vD.sid); }
        else { serr("Geen sessie geretourneerd."); }
      } else {
        if (!d.opts) return;
        const v = await startAuthentication({ optionsJSON: d.opts as unknown as PublicKeyCredentialRequestOptionsJSON });
        const vR = await AdminAPI.auth({ act: "log_v", c: d.opts?.challenge, resp: v }) as Response;
        if (!vR.ok) { serr("Verificatie van passkey mislukt."); sld(false); return; }
        const vD: AuthRes = await vR.json();
        if (vD.sid) { localStorage.setItem("sid", vD.sid); ssid(vD.sid); }
        else { serr("Geen sessie geretourneerd."); }
      }
    } catch (e: unknown) {
      serr(e instanceof Error ? e.message : "Inloggen mislukt.");
    }
    sld(false);
  };

  const lgout = () => { localStorage.removeItem("sid"); ssid(""); };

  if (sid) return (
    <>
      <div className="bg-mesh"><div className="bg-orb bg-orb--a" /><div className="bg-orb bg-orb--b" /></div>
      <div className="bg-grid" />
      <div className="bg-noise" />
      <D sid={sid} lgout={lgout} />
    </>
  );

  return (
    <>
      <div className="bg-mesh"><div className="bg-orb bg-orb--a" /><div className="bg-orb bg-orb--b" /></div>
      <div className="bg-grid" />
      <div className="bg-noise" />
      <div className="wrap wrap--center">
        <div className="bx">
          <div className="bx-title">{ca ? "Beheerder aanmaken" : "Beheerder Login"}</div>
          <div className="bx-sub">{ca ? "Maak de enige beheerdersaccount aan met een passkey." : "Log in met je gegevens en passkey."}</div>
          {err && <div className="err-msg">{err}</div>}
          <div className="fg">
            <label className="lbl">Gebruikersnaam</label>
            <input className="inp-f" type="text" value={u} onChange={(e) => su(e.target.value)} placeholder="admin" />
          </div>
          <div className="fg">
            <label className="lbl">Wachtwoord</label>
            <input className="inp-f" type="password" value={p} onChange={(e) => sp(e.target.value)} placeholder="••••••••" />
          </div>
          <button className="btn" disabled={ld || !u || !p} onClick={() => dolog(ca ? "reg_i" : "log_i")}>
            {ld ? <div className="spin" /> : (ca ? "Account aanmaken & Passkey registreren" : "Inloggen met Passkey")}
          </button>
        </div>
      </div>
    </>
  );
};

const D = ({ sid, lgout }: { sid: string; lgout: () => void }) => {
  const [d, sd] = useState<Entry[]>([]);
  const [tc, stc] = useState(0);
  const [ei, sei] = useState<string | null>(null);
  const [sv, ssv] = useState(false);

  const [facts, setFacts] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [cfi, setCfi] = useState<string | null>(null); // 'fact_new', 'fact_<id>', 'img_new', 'img_<id>'

  const rl = async () => {
    const rx = await AdminAPI.getEntries(sid) as Response;
    if (rx.status === 401) { lgout(); return; }
    const j = await rx.json();
    sd((j.r || []).map((x: Record<string, unknown>) => parseEntry(x)));
    stc(j.c || 0);

    const culture = await fetch('/api/culture').then(r => r.json());
    setFacts(culture.facts || []);
    setImages(culture.images || []);
  };

  useEffect(() => { rl(); }, [sid]);

  const save = async (data: Record<string, unknown>) => {
    ssv(true);
    const m = ei === 'new' ? 'POST' : 'PUT';
    const body = ei === 'new' ? data : { ...data, id: ei };
    await AdminAPI.saveEntry(sid, m, body);
    sei(null);
    await rl();
    ssv(false);
  };

  const del = async (id: string) => {
    if (!confirm("Zeker dat je dit woord wil verwijderen?")) return;
    await AdminAPI.deleteEntry(sid, id);
    sd(d.filter((x) => x.id !== id));
    stc((c) => c - 1);
  };

  const saveCult = async (data: Record<string, unknown>, type: 'fact' | 'image') => {
    ssv(true);
    const m = cfi?.endsWith('_new') ? 'POST' : 'PUT';
    const id = cfi?.split('_')[1];
    const body = m === 'POST' ? { ...data, type } : { ...data, id, type };
    await AdminAPI.saveCulture(sid, m, body);
    setCfi(null);
    await rl();
    ssv(false);
  };

  const delCult = async (id: string, type: 'fact' | 'image') => {
    if (!confirm(`Zeker dat je dit wil verwijderen?`)) return;
    await AdminAPI.deleteCulture(sid, id, type);
    await rl();
  };

  return (
    <div className="adm-wrap">
      <div className="adm-bar">
        <div className="adm-title">Dashboard</div>
        <button className="btn btn--ghost btn--sm" onClick={lgout}>
          <LogOut size={14} /> Uitloggen
        </button>
      </div>

      <div className="cnt">
        <div className="cnt-dot" />
        <span>{tc} {tc === 1 ? "item" : "items"} in de databank</span>
      </div>

      {!ei && (
        <button className="btn" style={{marginBottom: 24}} onClick={() => sei('new')}>
          <Plus size={16} /> Nieuw Woord Toevoegen
        </button>
      )}

      {ei && (
        <div style={{marginBottom: 32}}>
          <div className="adm-card-title">{ei === 'new' ? 'Nieuw Woord' : 'Woord Bewerken'}</div>
          {sv && <div className="cnt"><div className="spin" /></div>}
          {!sv && (
            <EF 
              init={ei === 'new' ? undefined : d.find(x => x.id === ei)} 
              onSave={save} 
              onCancel={() => sei(null)} 
            />
          )}
        </div>
      )}

      {!ei && (
        <div className="adm-card" style={{ animationDelay: "0.2s" }}>
          <div className="adm-card-title"><BookOpen size={16} style={{ display: "inline", marginRight: 8, verticalAlign: "middle" }} />Alle woorden</div>
          <div className="t-wrap">
            <table className="t">
              <thead>
                <tr>
                  <th>Woord</th>
                  <th>IPA</th>
                  <th>Nederlands</th>
                  <th>Soort</th>
                  <th>Status</th>
                  <th style={{ width: 100 }}>Acties</th>
                </tr>
              </thead>
              <tbody>
                {d.length === 0 && (
                  <tr><td colSpan={6} style={{ textAlign: "center", color: "var(--fg2)", padding: 32 }}>Nog geen woorden toegevoegd.</td></tr>
                )}
                {d.map((x) => (
                  <tr key={x.id}>
                    <td style={{ fontWeight: 600 }}>{x.word_lanes}</td>
                    <td style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--ac2)", fontSize: "0.85rem" }}>{x.broad_ipa}</td>
                    <td>{x.word_nl}</td>
                    <td>{x.pos ? <span className="badge badge--pos">{POS_SHORT[x.pos]}</span> : '-'}</td>
                    <td>
                      {x.entry_status !== 'actief' ? (
                        <span className={`badge badge--sts-${x.entry_status === 'archaïsch' ? 'b' : 'c'}`}>{STS_L[x.entry_status]}</span>
                      ) : <span className="badge badge--sts-a">Actief</span>}
                    </td>
                    <td>
                      <div style={{display: 'flex', gap: 6}}>
                        <button className="btn btn--ghost btn--sm" onClick={() => sei(x.id)} title="Bewerken" style={{padding: 6}}>
                          <Edit2 size={13} />
                        </button>
                        <button className="btn btn--rd btn--sm" onClick={() => del(x.id)} title="Verwijderen" style={{padding: 6}}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Culture Section */}
      {!ei && !cfi && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 40 }}>
          <div className="adm-card" style={{ animationDelay: "0.3s" }}>
            <div className="adm-card-title">Cultuur: Feiten</div>
            <button className="btn btn--sm" style={{marginBottom: 16}} onClick={() => setCfi('fact_new')}><Plus size={14}/> Nieuw Feit</button>
            <table className="t">
              <tbody>
                {facts.map(f => (
                  <tr key={f.id}>
                    <td>{f.fact}</td>
                    <td style={{width: 80}}>
                      <div style={{display: 'flex', gap: 6}}>
                        <button className="btn btn--ghost btn--sm" onClick={() => setCfi(`fact_${f.id}`)} style={{padding: 6}}><Edit2 size={13}/></button>
                        <button className="btn btn--rd btn--sm" onClick={() => delCult(f.id, 'fact')} style={{padding: 6}}><Trash2 size={13}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="adm-card" style={{ animationDelay: "0.4s" }}>
            <div className="adm-card-title">Cultuur: Afbeeldingen</div>
            <button className="btn btn--sm" style={{marginBottom: 16}} onClick={() => setCfi('img_new')}><Plus size={14}/> Nieuwe Afbeelding</button>
            <table className="t">
              <tbody>
                {images.map(i => (
                  <tr key={i.id}>
                    <td>
                      <img src={i.image_url} style={{height: 40, borderRadius: 4, display: 'block'}} alt="" />
                      <div style={{fontSize: '0.8rem', color: 'var(--fg2)'}}>{i.caption}</div>
                    </td>
                    <td style={{width: 80}}>
                      <div style={{display: 'flex', gap: 6}}>
                        <button className="btn btn--ghost btn--sm" onClick={() => setCfi(`img_${i.id}`)} style={{padding: 6}}><Edit2 size={13}/></button>
                        <button className="btn btn--rd btn--sm" onClick={() => delCult(i.id, 'image')} style={{padding: 6}}><Trash2 size={13}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Form for Culture */}
      {cfi && (
        <div className="adm-card" style={{marginTop: 40}}>
          <div className="adm-card-title">{cfi.startsWith('fact_') ? 'Feit Bewerken' : 'Afbeelding Bewerken'}</div>
          {sv ? <div className="spin" /> : (
            <div>
              {cfi.startsWith('fact_') ? (
                <textarea 
                  id="fact-input"
                  className="inp-f" 
                  style={{minHeight: 100, marginBottom: 16}}
                  defaultValue={cfi === 'fact_new' ? '' : facts.find(f => f.id === cfi.split('_')[1])?.fact} 
                  placeholder="Typ hier het feit..."
                />
              ) : (
                <>
                  <input id="img-url" className="inp-f" style={{marginBottom: 16}} type="text" placeholder="Beeld URL (https://...)" defaultValue={cfi === 'img_new' ? '' : images.find(i => i.id === cfi.split('_')[1])?.image_url} />
                  <input id="img-cap" className="inp-f" style={{marginBottom: 16}} type="text" placeholder="Onderschrift" defaultValue={cfi === 'img_new' ? '' : images.find(i => i.id === cfi.split('_')[1])?.caption} />
                </>
              )}
              <div style={{display: 'flex', gap: 12}}>
                <button className="btn" onClick={() => {
                  if (cfi.startsWith('fact_')) {
                    saveCult({ fact: (document.getElementById('fact-input') as HTMLTextAreaElement).value }, 'fact');
                  } else {
                    saveCult({ 
                      image_url: (document.getElementById('img-url') as HTMLInputElement).value,
                      caption: (document.getElementById('img-cap') as HTMLInputElement).value
                    }, 'image');
                  }
                }}>Opslaan</button>
                <button className="btn btn--ghost" onClick={() => setCfi(null)}>Annuleren</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
