import { useState, useEffect } from "react";
import { Search } from "lucide-react";

export const S = () => {
  const [q, sq] = useState("");
  const [r, sr] = useState<any[]>([]);

  useEffect(() => {
    if (!q) {
      sr([]);
      return;
    }
    const id = setTimeout(async () => {
      const rs = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      if (rs.ok) {
        const d = await rs.json();
        sr(d);
      }
    }, 200);
    return () => clearTimeout(id);
  }, [q]);

  return (
    <div className="c">
      <div className="bx">
        <h1 className="hd">Lanes Dictionary</h1>
        <div style={{ position: "relative" }}>
          <Search style={{ position: "absolute", left: 16, top: 18, color: "#9ca3af" }} size={20} />
          <input
            className="inp"
            style={{ paddingLeft: 48 }}
            type="text"
            placeholder="Search Het Lanes..."
            value={q}
            onChange={(e) => sq(e.target.value)}
          />
        </div>
      </div>
      {r.length > 0 && (
        <div className="lst">
          {r.map((x) => (
            <div key={x.id} className="itm">
              <h3 style={{ fontSize: "1.2rem", color: "#fff", marginBottom: 4 }}>
                {x.word_lanes} <span style={{ color: "#9ca3af", fontSize: "0.9rem" }}>{x.ipa && `/${x.ipa}/`}</span>
              </h3>
              <p style={{ color: "#f3f4f6", fontSize: "1.1rem" }}>{x.word_nl}</p>
              {x.example_sentence && (
                <p style={{ color: "#9ca3af", fontStyle: "italic", marginTop: 8 }}>"{x.example_sentence}"</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
