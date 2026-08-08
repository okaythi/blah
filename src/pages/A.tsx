import { useState, useEffect } from "react";
import { startRegistration, startAuthentication } from "@simplewebauthn/browser";
import { LogOut, Plus, Trash2, BookOpen } from "lucide-react";

interface Entry {
  id: string;
  word_lanes: string;
  ipa: string;
  word_nl: string;
  example_sentence: string;
  additional_metadata: string;
}

interface AuthRes {
  opts?: any;
  id?: string;
  uid?: string;
  sid?: string;
  c?: number;
}

interface FormState {
  wl: string;
  ipa: string;
  wnl: string;
  ex: string;
  md: string;
}

const init: FormState = { wl: "", ipa: "", wnl: "", ex: "", md: "" };

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
      if (!r.ok) { serr("Invalid credentials."); sld(false); return; }
      const d: AuthRes = await r.json();

      if (act === "reg_i") {
        const v = await startRegistration({ optionsJSON: d.opts });
        const vR = await fetch("/api/admin/auth", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ act: "reg_v", id: d.id, u, p, c: d.opts.challenge, resp: v }),
        });
        if (!vR.ok) { serr("Registration verification failed."); sld(false); return; }
        const vD: AuthRes = await vR.json();
        if (vD.sid) { localStorage.setItem("sid", vD.sid); ssid(vD.sid); }
        else { serr("No session returned."); }
      } else {
        const v = await startAuthentication({ optionsJSON: d.opts });
        const vR = await fetch("/api/admin/auth", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ act: "log_v", c: d.opts.challenge, resp: v }),
        });
        if (!vR.ok) { serr("Passkey verification failed."); sld(false); return; }
        const vD: AuthRes = await vR.json();
        if (vD.sid) { localStorage.setItem("sid", vD.sid); ssid(vD.sid); }
        else { serr("No session returned."); }
      }
    } catch (e: unknown) {
      serr(e instanceof Error ? e.message : "Authentication failed.");
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
          <div className="bx-title">{ca ? "Create Admin" : "Admin Login"}</div>
          <div className="bx-sub">{ca ? "Set up the sole admin account with a passkey." : "Authenticate with your credentials and passkey."}</div>
          {err && <div className="err-msg">{err}</div>}
          <div className="fg">
            <label className="lbl">Username</label>
            <input className="inp-f" type="text" value={u} onChange={(e) => su(e.target.value)} placeholder="admin" />
          </div>
          <div className="fg">
            <label className="lbl">Password</label>
            <input className="inp-f" type="password" value={p} onChange={(e) => sp(e.target.value)} placeholder="••••••••" />
          </div>
          <button className="btn" disabled={ld || !u || !p} onClick={() => dolog(ca ? "reg_i" : "log_i")}>
            {ld ? <div className="spin" /> : (ca ? "Create Account & Register Passkey" : "Login with Passkey")}
          </button>
        </div>
      </div>
    </>
  );
};

const D = ({ sid, lgout }: { sid: string; lgout: () => void }) => {
  const [d, sd] = useState<Entry[]>([]);
  const [tc, stc] = useState(0);
  const [f, sf] = useState<FormState>({ ...init });
  const [sv, ssv] = useState(false);

  const rl = async () => {
    const rx = await fetch("/api/admin/entries", { headers: { Authorization: `Bearer ${sid}` } });
    if (rx.status === 401) { lgout(); return; }
    const j = await rx.json();
    sd(j.r || []);
    stc(j.c || 0);
  };

  useEffect(() => { rl(); }, [sid]);

  const add = async () => {
    ssv(true);
    await fetch("/api/admin/entries", {
      method: "POST",
      headers: { Authorization: `Bearer ${sid}`, "content-type": "application/json" },
      body: JSON.stringify(f),
    });
    sf({ ...init });
    await rl();
    ssv(false);
  };

  const del = async (id: string) => {
    await fetch(`/api/admin/entries?id=${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${sid}` } });
    sd(d.filter((x) => x.id !== id));
    stc((c) => c - 1);
  };

  return (
    <div className="adm-wrap">
      <div className="adm-bar">
        <div className="adm-title">Dashboard</div>
        <button className="btn btn--ghost btn--sm" onClick={lgout}>
          <LogOut size={14} /> Logout
        </button>
      </div>

      <div className="cnt">
        <div className="cnt-dot" />
        <span>{tc} {tc === 1 ? "entry" : "entries"} in database</span>
      </div>

      <div className="adm-card">
        <div className="adm-card-title"><Plus size={16} style={{ display: "inline", marginRight: 8, verticalAlign: "middle" }} />Add Entry</div>
        <div className="adm-grid">
          <div className="fg">
            <label className="lbl">'t Lanes</label>
            <input className="inp-f" placeholder="e.g. koekeansen" value={f.wl} onChange={(e) => sf({ ...f, wl: e.target.value })} />
          </div>
          <div className="fg">
            <label className="lbl">IPA</label>
            <input className="inp-f" placeholder="e.g. kukɑnsə" value={f.ipa} onChange={(e) => sf({ ...f, ipa: e.target.value })} />
          </div>
          <div className="fg">
            <label className="lbl">Nederlands</label>
            <input className="inp-f" placeholder="e.g. koekjes" value={f.wnl} onChange={(e) => sf({ ...f, wnl: e.target.value })} />
          </div>
          <div className="fg">
            <label className="lbl">Example</label>
            <input className="inp-f" placeholder="Use in a sentence..." value={f.ex} onChange={(e) => sf({ ...f, ex: e.target.value })} />
          </div>
        </div>
        <button className="btn" style={{ marginTop: 8 }} disabled={sv || !f.wl || !f.wnl} onClick={add}>
          {sv ? <div className="spin" /> : <><Plus size={16} /> Save Entry</>}
        </button>
      </div>

      <div className="adm-card" style={{ animationDelay: "0.2s" }}>
        <div className="adm-card-title"><BookOpen size={16} style={{ display: "inline", marginRight: 8, verticalAlign: "middle" }} />All Entries</div>
        <div className="t-wrap">
          <table className="t">
            <thead>
              <tr>
                <th>Word</th>
                <th>IPA</th>
                <th>Nederlands</th>
                <th>Example</th>
                <th style={{ width: 80 }}></th>
              </tr>
            </thead>
            <tbody>
              {d.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: "center", color: "var(--fg2)", padding: 32 }}>No entries yet.</td></tr>
              )}
              {d.map((x) => (
                <tr key={x.id}>
                  <td style={{ fontWeight: 600 }}>{x.word_lanes}</td>
                  <td style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--ac2)", fontSize: "0.85rem" }}>{x.ipa}</td>
                  <td>{x.word_nl}</td>
                  <td style={{ color: "var(--fg2)", fontSize: "0.85rem" }}>{x.example_sentence}</td>
                  <td>
                    <button className="btn btn--rd btn--sm" onClick={() => del(x.id)}>
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
