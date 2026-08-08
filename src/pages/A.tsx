import { useState, useEffect } from "react";
import { startRegistration, startAuthentication } from "@simplewebauthn/browser";

export const A = () => {
  const [ca, sca] = useState(false);
  const [u, su] = useState("");
  const [p, sp] = useState("");
  const [sid, ssid] = useState(localStorage.getItem("sid") || "");
  const [err, serr] = useState("");

  useEffect(() => {
    fetch("/api/admin/auth", { method: "POST", body: JSON.stringify({ act: "chk" }) })
      .then((r) => r.json())
      .then((d) => {
        if (d.c === 0) sca(true);
      })
      .catch(() => {});
  }, []);

  const dolog = async (act: string) => {
    try {
      serr("");
      const r = await fetch("/api/admin/auth", { method: "POST", body: JSON.stringify({ act, u, p }) });
      if (!r.ok) { serr("Error"); return; }
      const d = await r.json();
      
      let v;
      if (act === "reg_i") {
        v = await startRegistration(d.opts);
        const vR = await fetch("/api/admin/auth", { method: "POST", body: JSON.stringify({ act: "reg_v", id: d.id, u, p, c: d.opts.challenge, resp: v }) });
        const vD = await vR.json();
        if (vD.sid) {
          localStorage.setItem("sid", vD.sid);
          ssid(vD.sid);
        }
      } else {
        v = await startAuthentication(d.opts);
        const vR = await fetch("/api/admin/auth", { method: "POST", body: JSON.stringify({ act: "log_v", c: d.opts.challenge, resp: v }) });
        const vD = await vR.json();
        if (vD.sid) {
          localStorage.setItem("sid", vD.sid);
          ssid(vD.sid);
        }
      }
    } catch (e: any) {
      serr(e.message || "Error");
    }
  };

  if (sid) return <D sid={sid} lgout={() => { localStorage.removeItem("sid"); ssid(""); }} />;

  return (
    <div className="c">
      <div className="bx">
        <h1 className="hd">Admin Access</h1>
        {err && <div style={{ color: "#ef4444", marginBottom: 16 }}>{err}</div>}
        <div className="fg">
          <label className="lbl">Username</label>
          <input className="inp" type="text" value={u} onChange={(e) => su(e.target.value)} />
        </div>
        <div className="fg">
          <label className="lbl">Password</label>
          <input className="inp" type="password" value={p} onChange={(e) => sp(e.target.value)} />
        </div>
        {ca ? (
          <button className="btn" onClick={() => dolog("reg_i")}>Create Account & Passkey</button>
        ) : (
          <button className="btn" onClick={() => dolog("log_i")}>Login with Passkey</button>
        )}
      </div>
    </div>
  );
};

const D = ({ sid, lgout }: { sid: string, lgout: () => void }) => {
  const [d, sd] = useState<any[]>([]);
  const [f, sf] = useState({ wl: "", ipa: "", wnl: "", ex: "", md: "" });

  useEffect(() => {
    fetch("/api/admin/entries", { headers: { Authorization: `Bearer ${sid}` } })
      .then(r => r.json())
      .then(x => sd(x.r || []));
  }, [sid]);

  const sv = async () => {
    await fetch("/api/admin/entries", {
      method: "POST",
      headers: { Authorization: `Bearer ${sid}` },
      body: JSON.stringify(f)
    });
    sf({ wl: "", ipa: "", wnl: "", ex: "", md: "" });
    const rx = await fetch("/api/admin/entries", { headers: { Authorization: `Bearer ${sid}` } }).then(r => r.json());
    sd(rx.r || []);
  };

  return (
    <div className="c-adm">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 className="hd">Dashboard</h1>
        <button className="btn" onClick={lgout}>Logout</button>
      </div>
      <div className="bx bx-adm">
        <h2 style={{ marginBottom: 16 }}>Add Entry</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
          <input className="inp" placeholder="Het Lanes Word" value={f.wl} onChange={e => sf({...f, wl: e.target.value})} />
          <input className="inp" placeholder="IPA" value={f.ipa} onChange={e => sf({...f, ipa: e.target.value})} />
          <input className="inp" placeholder="Dutch Word" value={f.wnl} onChange={e => sf({...f, wnl: e.target.value})} />
          <input className="inp" placeholder="Example" value={f.ex} onChange={e => sf({...f, ex: e.target.value})} />
        </div>
        <button className="btn" onClick={sv}>Save</button>
      </div>
      <table className="t">
        <thead>
          <tr>
            <th>Word</th>
            <th>IPA</th>
            <th>NL</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {d.map(x => (
            <tr key={x.id}>
              <td>{x.word_lanes}</td>
              <td>{x.ipa}</td>
              <td>{x.word_nl}</td>
              <td>
                <button className="btn" style={{ padding: "6px 12px", fontSize: "0.8rem", background: "#ef4444" }} onClick={async () => {
                  await fetch(`/api/admin/entries?id=${x.id}`, { method: "DELETE", headers: { Authorization: `Bearer ${sid}` } });
                  sd(d.filter(y => y.id !== x.id));
                }}>Del</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
