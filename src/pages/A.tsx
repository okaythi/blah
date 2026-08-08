import { useState, useEffect } from "react";
import { startRegistration, startAuthentication } from "@simplewebauthn/browser";
import { LogOut, BookOpen, Edit2, Trash2, Plus } from "lucide-react";
import type { Entry } from "../types";
import { parseEntry, POS_SHORT, STS_L } from "../types";
import { EF } from "../components/EF";

interface AuthRes {
  opts?: any;
  id?: string;
  uid?: string;
  sid?: string;
  c?: number;
}

export const A = () => {
  const [ca, sca] = useState(false);
  const [u, su] = useState("");
  const [p, sp] = useState("");
  const [sid, ssid] = useState(localStorage.getItem("sid") || "");
  const [err, serr] = useState("");
  const [ld, sld] = useState(false);

  useEffect(() => {
    fetch("/api/admin/auth", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ act: "chk" }),
    })
      .then((r) => r.json())
      .then((d: AuthRes) => { if (d.c === 0) sca(true); })
      .catch(() => {});
  }, []);

  const dolog = async (act: string) => {
    try {
      serr("");
      sld(true);
      const r = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ act, u, p }),
      });
      if (!r.ok) { serr("Ongeldige inloggegevens."); sld(false); return; }
      const d: AuthRes = await r.json();

      if (act === "reg_i") {
        const v = await startRegistration({ optionsJSON: d.opts });
        const vR = await fetch("/api/admin/auth", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ act: "reg_v", id: d.id, u, p, c: d.opts.challenge, resp: v }),
        });
        if (!vR.ok) { serr("Verificatie van registratie mislukt."); sld(false); return; }
        const vD: AuthRes = await vR.json();
        if (vD.sid) { localStorage.setItem("sid", vD.sid); ssid(vD.sid); }
        else { serr("Geen sessie geretourneerd."); }
      } else {
        const v = await startAuthentication({ optionsJSON: d.opts });
        const vR = await fetch("/api/admin/auth", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ act: "log_v", c: d.opts.challenge, resp: v }),
        });
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
  const [ei, sei] = useState<string | null>(null); // editing ID, 'new' for creating
  const [sv, ssv] = useState(false);

  const rl = async () => {
    const rx = await fetch("/api/admin/entries", { headers: { Authorization: `Bearer ${sid}` } });
    if (rx.status === 401) { lgout(); return; }
    const j = await rx.json();
    sd((j.r || []).map((x: any) => parseEntry(x)));
    stc(j.c || 0);
  };

  useEffect(() => { rl(); }, [sid]);

  const save = async (data: any) => {
    ssv(true);
    const m = ei === 'new' ? 'POST' : 'PUT';
    const body = ei === 'new' ? data : { ...data, id: ei };
    await fetch("/api/admin/entries", {
      method: m,
      headers: { Authorization: `Bearer ${sid}`, "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    sei(null);
    await rl();
    ssv(false);
  };

  const del = async (id: string) => {
    if (!confirm("Zeker dat je dit woord wil verwijderen?")) return;
    await fetch(`/api/admin/entries?id=${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${sid}` } });
    sd(d.filter((x) => x.id !== id));
    stc((c) => c - 1);
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
    </div>
  );
};
