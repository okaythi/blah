import { useState } from 'react';
import { ChevronDown, Plus, Trash2 } from 'lucide-react';
import type { Entry, Pos, Reg, Sts, Def, Colloc, MorphNoun, MorphVerb, MorphAdj } from '../../../types';
import { POS_L, REG_L, STS_L } from '../../../types';

interface EFProps {
  init?: Entry;
  onSave: (data: Record<string, unknown>) => Promise<void>;
  onCancel?: () => void;
}

const Sec = ({ title, open, onToggle, children }: { title: string; open: boolean; onToggle: () => void; children: React.ReactNode }) => (
  <div className="sec">
    <div className={`sec-hd ${open ? 'sec-hd--open' : ''}`} onClick={onToggle}>
      <span>{title}</span>
      <ChevronDown size={18} className="lucide" />
    </div>
    {open && <div className="sec-bd">{children}</div>}
  </div>
);

export function EF({ init, onSave, onCancel }: EFProps) {
  const [wl, setWl] = useState(init?.word_lanes || '');
  const [lemma, setLemma] = useState(init?.lemma || '');
  const [wnl, setWnl] = useState(init?.word_nl || '');
  const [pos, setPos] = useState<Pos | ''>(init?.pos || '');
  const [ex, setEx] = useState(init?.example_sentence || '');

  const [bipa, setBipa] = useState(init?.broad_ipa || '');
  const [nipa, setNipa] = useState(init?.narrow_ipa || '');
  const [tone, setTone] = useState(init?.tone || '');
  const [audio, setAudio] = useState(init?.audio_url || '');

  type AnyMorph = Partial<MorphNoun & MorphVerb & MorphAdj>;
  const [morph, setMorph] = useState<AnyMorph>(init?.morph as AnyMorph || {});
  const [defs, setDefs] = useState<Def[]>(init?.defs || []);
  const [colloc, setColloc] = useState<Colloc[]>(init?.colloc || []);

  const [reg, setReg] = useState<Reg>(init?.register || 'informeel');
  const [sts, setSts] = useState<Sts>(init?.entry_status || 'actief');
  const [etym, setEtym] = useState(init?.etym || '');

  const [openSec, setOpenSec] = useState<Record<string, boolean>>({ basis: true });

  const toggle = (s: string) => setOpenSec(prev => ({ ...prev, [s]: !prev[s] }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wl || !wnl) return;
    await onSave({
      wl, lemma, bipa, nipa, audio, wnl, ex, pos, tone, morph, defs, colloc, reg, sts, etym
    });
  };

  const updateMorph = (k: keyof AnyMorph, v: unknown) => setMorph((p) => ({ ...p, [k]: v } as AnyMorph));
  const updateConj = (k: string, v: string) => setMorph((p) => ({ ...p, conj: { ...(p.conj || {}), [k]: v } } as AnyMorph));

  return (
    <form onSubmit={handleSave} className="adm-card">
      <Sec title="Basisgegevens" open={openSec.basis} onToggle={() => toggle('basis')}>
        <div className="fg">
          <label className="lbl">Woord in 't Lanes *</label>
          <input className="inp-f" value={wl} onChange={e => setWl(e.target.value)} required />
        </div>
        <div className="fg">
          <label className="lbl">Lemma (Standaardvorm)</label>
          <input className="inp-f" value={lemma} onChange={e => setLemma(e.target.value)} />
        </div>
        <div className="fg">
          <label className="lbl">Standaardnederlands *</label>
          <input className="inp-f" value={wnl} onChange={e => setWnl(e.target.value)} required />
        </div>
        <div className="fg">
          <label className="lbl">Woordsoort</label>
          <select className="inp-f" value={pos} onChange={e => setPos(e.target.value as Pos)}>
            <option value="">-- Selecteer --</option>
            {Object.entries(POS_L).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div className="fg">
          <label className="lbl">Voorbeeldzin</label>
          <textarea className="inp-f" value={ex} onChange={e => setEx(e.target.value)} rows={2} />
        </div>
      </Sec>

      <Sec title="Fonetiek & Prosodie" open={openSec.fon} onToggle={() => toggle('fon')}>
        <div className="adm-grid">
          <div className="fg">
            <label className="lbl">Brede Transcriptie (IPA)</label>
            <input className="inp-f" value={bipa} onChange={e => setBipa(e.target.value)} placeholder="bijv. bɑl" />
          </div>
          <div className="fg">
            <label className="lbl">Nauwe Transcriptie (IPA)</label>
            <input className="inp-f" value={nipa} onChange={e => setNipa(e.target.value)} placeholder="bijv. bɑɫ" />
          </div>
          <div className="fg adm-grid-full">
            <label className="lbl">Prosodie / Intonatie</label>
            <input className="inp-f" value={tone} onChange={e => setTone(e.target.value)} placeholder="Opmerkingen over toonverloop..." />
          </div>
          <div className="fg adm-grid-full">
            <label className="lbl">Audio URL</label>
            <input className="inp-f" value={audio} onChange={e => setAudio(e.target.value)} />
          </div>
        </div>
      </Sec>

      {['zn', 'ww', 'bn'].includes(pos) && (
        <Sec title="Morfologie" open={openSec.morph} onToggle={() => toggle('morph')}>
          {pos === 'zn' && (
            <div className="adm-grid">
              <div className="fg">
                <label className="lbl">Geslacht</label>
                <select className="inp-f" value={morph.gnd || ''} onChange={e => updateMorph('gnd', e.target.value as 'm' | 'v' | 'o')}>
                  <option value="">--</option>
                  <option value="m">Mannelijk</option>
                  <option value="v">Vrouwelijk</option>
                  <option value="o">Onzijdig</option>
                </select>
              </div>
              <div className="fg">
                <label className="lbl">Meervoud</label>
                <input className="inp-f" value={morph.pl || ''} onChange={e => updateMorph('pl', e.target.value)} />
              </div>
              <div className="fg">
                <label className="lbl">Verkleinwoord</label>
                <input className="inp-f" value={morph.dim || ''} onChange={e => updateMorph('dim', e.target.value)} />
              </div>
            </div>
          )}
          
          {pos === 'ww' && (
            <div className="adm-grid">
              <div className="fg adm-grid-full toggle-row">
                <label className="lbl" style={{marginBottom:0}}>Sterk Werkwoord?</label>
                <div className={`toggle ${morph.sterk ? 'toggle--on' : ''}`} onClick={() => updateMorph('sterk', !morph.sterk)}>
                  <div className="toggle-thumb" />
                </div>
              </div>
              {['ich', 'gè', 'hè', 'we', 'gull', 'zij'].map(p => (
                <div key={p} className="fg">
                  <label className="lbl">{p}</label>
                  <input className="inp-f" value={morph.conj?.[p] || ''} onChange={e => updateConj(p, e.target.value)} />
                </div>
              ))}
              <div className="fg">
                <label className="lbl">Verleden Tijd</label>
                <input className="inp-f" value={morph.vt || ''} onChange={e => updateMorph('vt', e.target.value)} />
              </div>
              <div className="fg">
                <label className="lbl">Voltooid Deelwoord</label>
                <input className="inp-f" value={morph.vd || ''} onChange={e => updateMorph('vd', e.target.value)} />
              </div>
            </div>
          )}

          {pos === 'bn' && (
            <div className="adm-grid">
              <div className="fg">
                <label className="lbl">Vergrotend</label>
                <input className="inp-f" value={morph.vgr || ''} onChange={e => updateMorph('vgr', e.target.value)} />
              </div>
              <div className="fg">
                <label className="lbl">Overtreffend</label>
                <input className="inp-f" value={morph.ovt || ''} onChange={e => updateMorph('ovt', e.target.value)} />
              </div>
              <div className="fg">
                <label className="lbl">Verbuiging</label>
                <input className="inp-f" value={morph.verbuig || ''} onChange={e => updateMorph('verbuig', e.target.value)} />
              </div>
            </div>
          )}
        </Sec>
      )}

      <Sec title="Extra definities" open={openSec.defs} onToggle={() => toggle('defs')}>
        {defs.map((d, i) => (
          <div key={i} className="ef-row" style={{flexDirection: 'column', paddingBottom: 16, borderBottom: '1px solid var(--gls-br)'}}>
            <div style={{display: 'flex', width: '100%', gap: 12}}>
              <div className="fg" style={{flex: 1, marginBottom: 0}}>
                <label className="lbl">Definitie {i+1}</label>
                <input className="inp-f" value={d.def} onChange={e => { const n = [...defs]; n[i].def = e.target.value; setDefs(n); }} />
              </div>
              <button type="button" className="ef-rm" onClick={() => setDefs(defs.filter((_, idx) => idx !== i))}><Trash2 size={16} /></button>
            </div>
            <div style={{display: 'flex', width: '100%', gap: 12}}>
              <div className="fg" style={{flex: 2, marginBottom: 0}}>
                <label className="lbl">Voorbeeldzin</label>
                <input className="inp-f" value={d.ex} onChange={e => { const n = [...defs]; n[i].ex = e.target.value; setDefs(n); }} placeholder="Voorbeeldzin" />
              </div>
              <div className="fg" style={{flex: 1, marginBottom: 0}}>
                <label className="lbl">Bron</label>
                <input className="inp-f" value={d.src} onChange={e => { const n = [...defs]; n[i].src = e.target.value; setDefs(n); }} />
              </div>
            </div>
          </div>
        ))}
        <button type="button" className="ef-add" onClick={() => setDefs([...defs, { sn: defs.length + 1, def: '', ex: '', src: '' }])}>
          <Plus size={16} /> Extra definitie toevoegen
        </button>
      </Sec>

      <Sec title="Gebruik & Context" open={openSec.geb} onToggle={() => toggle('geb')}>
        <div className="adm-grid">
          <div className="fg">
            <label className="lbl">Register</label>
            <select className="inp-f" value={reg} onChange={e => setReg(e.target.value as Reg)}>
              {Object.entries(REG_L).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div className="fg">
            <label className="lbl">Status</label>
            <select className="inp-f" value={sts} onChange={e => setSts(e.target.value as Sts)}>
              {Object.entries(STS_L).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
        </div>

        <label className="lbl" style={{marginTop: 16}}>Collocaties</label>
        {colloc.map((c, i) => (
          <div key={i} className="ef-row">
            <input className="inp-f" placeholder="Woord(en)" value={c.w} onChange={e => { const n = [...colloc]; n[i].w = e.target.value; setColloc(n); }} />
            <input className="inp-f" placeholder="Voorbeeld" value={c.ex} onChange={e => { const n = [...colloc]; n[i].ex = e.target.value; setColloc(n); }} style={{flex: 2}} />
            <button type="button" className="ef-rm" onClick={() => setColloc(colloc.filter((_, idx) => idx !== i))}><Trash2 size={16} /></button>
          </div>
        ))}
        <button type="button" className="ef-add" onClick={() => setColloc([...colloc, { w: '', ex: '' }])}>
          <Plus size={16} /> Collocatie toevoegen
        </button>
      </Sec>

      <Sec title="Etymologie" open={openSec.etym} onToggle={() => toggle('etym')}>
        <textarea className="inp-f" value={etym} onChange={e => setEtym(e.target.value)} rows={4} placeholder="Oorsprong van het woord..." />
      </Sec>

      <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
        <button type="submit" className="btn">Opslaan</button>
        {onCancel && <button type="button" className="btn btn--ghost" onClick={onCancel}>Annuleren</button>}
      </div>
    </form>
  );
}
