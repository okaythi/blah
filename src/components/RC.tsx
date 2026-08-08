import { useState } from 'react';
import { Volume2, ChevronDown } from 'lucide-react';
import type { Entry, XRef, MorphNoun, MorphVerb, MorphAdj } from '../types';
import { POS_SHORT, REG_L, STS_L, REL_L } from '../types';

export function RC({ e, xrefs }: { e: Entry; xrefs?: XRef[] }) {
  const [etymOpen, setEtymOpen] = useState(false);

  const playAudio = () => {
    if (e.audio_url) new Audio(e.audio_url).play();
  };

  const renderMorph = () => {
    if (!e.morph || !e.pos) return null;
    
    if (e.pos === 'zn') {
      const m = e.morph as MorphNoun;
      return (
        <div className="morph-grid">
          <div><div className="morph-lbl">Geslacht</div><div className="morph-val">{m.gnd}</div></div>
          {m.pl && <div><div className="morph-lbl">Meervoud</div><div className="morph-val">{m.pl}</div></div>}
          {m.dim && <div><div className="morph-lbl">Verkleinwoord</div><div className="morph-val">{m.dim}</div></div>}
        </div>
      );
    }
    
    if (e.pos === 'ww') {
      const m = e.morph as MorphVerb;
      return (
        <div className="morph-grid">
          <div><div className="morph-lbl">Vervoeging</div>
            <table className="conj-tbl">
              <tbody>
                {m.conj?.ich && <tr><td>ich</td><td>{m.conj.ich}</td></tr>}
                {m.conj?.['gè'] && <tr><td>gè</td><td>{m.conj['gè']}</td></tr>}
                {m.conj?.['hè'] && <tr><td>hè/zij/et</td><td>{m.conj['hè']}</td></tr>}
                {m.conj?.we && <tr><td>we</td><td>{m.conj.we}</td></tr>}
                {m.conj?.gull && <tr><td>gull</td><td>{m.conj.gull}</td></tr>}
                {m.conj?.zij && <tr><td>zij</td><td>{m.conj.zij}</td></tr>}
              </tbody>
            </table>
          </div>
          <div>
            <div className="morph-lbl">Type</div><div className="morph-val" style={{marginBottom: 8}}>{m.sterk ? 'Sterk' : 'Zwak'}</div>
            <div className="morph-lbl">Verleden Tijd</div><div className="morph-val" style={{marginBottom: 8}}>{m.vt || '-'}</div>
            <div className="morph-lbl">Voltooid Deelwoord</div><div className="morph-val">{m.vd || '-'}</div>
          </div>
        </div>
      );
    }

    if (e.pos === 'bn') {
      const m = e.morph as MorphAdj;
      return (
        <div className="morph-grid">
          {m.vgr && <div><div className="morph-lbl">Vergrotend</div><div className="morph-val">{m.vgr}</div></div>}
          {m.ovt && <div><div className="morph-lbl">Overtreffend</div><div className="morph-val">{m.ovt}</div></div>}
          {m.verbuig && <div><div className="morph-lbl">Verbuiging</div><div className="morph-val">{m.verbuig}</div></div>}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="itm">
      <div className="itm-head">
        <div className="itm-word">{e.word_lanes}</div>
        {e.lemma && e.lemma !== e.word_lanes && <div style={{color: 'var(--fg2)', fontSize: '0.9rem'}}>→ {e.lemma}</div>}
        {e.pos && <div className="badge badge--pos" title={`Woordsoort: ${POS_SHORT[e.pos]}`}>{POS_SHORT[e.pos]}</div>}
        {e.audio_url && <button onClick={playAudio} className="audio-btn" title="Beluister"><Volume2 size={16} /></button>}
      </div>

      <div style={{display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap'}}>
        {e.broad_ipa && <div className="itm-ipa" title="Brede transcriptie">/{e.broad_ipa}/</div>}
        {e.narrow_ipa && <div className="itm-ipa" style={{opacity: 0.7}} title="Nauwe transcriptie">[{e.narrow_ipa}]</div>}
        {e.tone && <div className="badge badge--tone" title={`Prosodie/Intonatie: ${e.tone}`}>{e.tone}</div>}
        {e.register && e.register !== 'informeel' && <div className="badge badge--reg" title={`Register: ${REG_L[e.register]}`}>{REG_L[e.register]}</div>}
        {e.entry_status && e.entry_status !== 'actief' && <div className={`badge badge--sts-${e.entry_status === 'archaïsch' ? 'b' : 'c'}`} title={`Status: ${STS_L[e.entry_status]}`}>{STS_L[e.entry_status]}</div>}
      </div>

      <div className="itm-nl">{e.word_nl}</div>
      {e.example_sentence && <div className="itm-ex">"{e.example_sentence}"</div>}

      {renderMorph()}

      {e.defs && e.defs.length > 0 && (
        <div className="def-list">
          {e.defs.map((d, i) => (
            <div key={i} className="def-item">
              <div className="def-sn">{d.sn || i + 1}</div>
              <div className="def-cont">
                <div className="def-text">{d.def}</div>
                {d.ex && <div className="def-ex">"{d.ex}"</div>}
                {d.src && <div className="def-src">— {d.src}</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {e.colloc && e.colloc.length > 0 && (
        <div className="colloc-sec">
          {e.colloc.map((c, i) => (
            <div key={i} className="colloc-pill"><strong>{c.w}</strong> <span>{c.ex}</span></div>
          ))}
        </div>
      )}

      {e.etym && (
        <div className="etym-sec">
          <div className={`sec-hd ${etymOpen ? 'sec-hd--open' : ''}`} onClick={() => setEtymOpen(!etymOpen)}>
            <span>Etymologie</span>
            <ChevronDown size={16} className="lucide" />
          </div>
          {etymOpen && <div className="sec-bd etym-text">{e.etym}</div>}
        </div>
      )}

      {xrefs && xrefs.length > 0 && (
        <div className="xref-sec">
          {['synoniem', 'antoniem', 'verwant'].map(rel => {
            const xr = xrefs.filter(x => x.rel === rel);
            if (!xr.length) return null;
            return (
              <div key={rel} className="xref-group">
                <div className="xref-lbl">{REL_L[rel as keyof typeof REL_L]}:</div>
                {xr.map(x => (
                  <span key={x.id} className={`xref-pill xref-pill--${rel.substring(0,3)}`}>
                    {x.tgt_word || 'Link'}
                  </span>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
