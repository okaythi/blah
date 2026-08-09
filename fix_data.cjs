const fs = require('fs');

try {
  const raw = fs.readFileSync('db_dump_for_audit.json', 'utf16le');
  const jsonStart = raw.indexOf('[');
  const jsonEnd = raw.lastIndexOf(']');
  const jsonStr = raw.substring(jsonStart, jsonEnd + 1);
  const data = JSON.parse(jsonStr)[0].results;

  let sql = '';

  const updateMap = {
    // 1. "een" -> "e/ne/nen"
    'kastaar': { field: 'example_sentence', old: "Da's een flinken kastaar gewoëde ze!", new: "Da's ne flinken kastaar gewoëde ze!" },
    'menneke': { field: 'example_sentence', old: "Da's een flink menneke gewoëde.", new: "Da's e flink menneke gewoëde." },
    'klèèn': { field: 'example_sentence', old: "Wa een klèèn hummelke is da.", new: "Wa e klèèn hummelke is da." },
    'kaffee': { field: 'example_sentence', old: "We goën een pintje drinke in 't kaffee o'de mèèrt.", new: "We goën e pintje drinke in 't kaffee o'de mèèrt." },
    'eike': { field: 'example_sentence', old: "Bakt mich es een eike mè spek on de noen.", new: "Bakt mich es n eike mè spek on de noen." },
    'graaf': { field: 'example_sentence', old: "Da's een graaf masjien da ge doa höbt.", new: "Da's e graaf masjien da ge doa höbt." },
    'iniejensmelte': { field: 'defs[0].ex', old: "Dat is een prachtig iniejensmelte van tradisies.", new: "Da's e prachtig iniejensmelte van tradisies." },
    'straf': { field: 'defs[0].ex', old: "Da's een straf veroal dat ge doa vertelt.", new: "Da's e straf veroal da ge doa vertelt." },
    
    // 2. Specific vocabulary
    'aindelijk': { field: 'defs[0].ex', old: "Aindelijk zeet ge doa trug thuis.", new: "Aindelijk zeet ge doa trug taas." },
    'oëg': { field: 'example_sentence', old: "M'n oëge doen zieër van 't wèèrek.", new: "M'n oëge doën zieër van 't wèèrek." },
    'vrieë': { field: 'example_sentence', old: "Da's e vrieë schoeën kind he!", new: "Da's e vrieë schoeën bloag he!" },
    'gelek': { field: 'example_sentence', old: "Ge edd euverschoot van gelek euver da iniejensmelte van aal da geleulf zo van like...", new: "Ge edd euverschoot van gelek euver da iniejensmelte van aal da geleulf zoeë van like..." },
    'ontaard': { field: 'example_sentence', old: "Zo van, da begint vrumd ontaard gepakt van de bazen...", new: "Zoeë van, da begint vrumd ontaard gepakt van de bazen..." },

    // 3. Complete rewrites
    'stik': { field: 'colloc[0].ex', old: "Ik moet u daar wel een stuk(je) gelijk in geven.", new: "Ich moet a doa wel e stik(sje) gelek in gieve." },
    'euro': { field: 'colloc[0].ex', old: "Eindelijk het inzicht of begrip krijgen.", new: "Aindelijk et inzicht of begrip kraage." },
    'draai': { field: 'colloc[0].ex', old: "Een eigen wending of invulling geven aan iets dat is overgenomen.", new: "Nen aage wending of invulling gieve oan gèt da is oeuvergenomme." }
  };

  let updates = 0;

  for (const r of data) {
    const wl = r.word_lanes;
    let modified = false;
    let ex = r.example_sentence || "";
    let defs = [];
    try { defs = JSON.parse(r.defs || "[]"); } catch(e) {}
    let colloc = [];
    try { colloc = JSON.parse(r.colloc || "[]"); } catch(e) {}
    let word_lanes = r.word_lanes;
    let lemma = r.lemma || r.word_lanes;

    // Special case for 'blaag' -> 'bloag'
    if (wl === 'blaag') {
      word_lanes = 'bloag';
      if (lemma === 'blaag') lemma = 'bloag';
      modified = true;
    }

    if (updateMap[wl]) {
      const u = updateMap[wl];
      if (u.field === 'example_sentence') {
        if (ex === u.old) {
          ex = u.new;
          modified = true;
        } else {
          console.warn(`Mismatch in ${wl}: Expected "${u.old}", got "${ex}"`);
        }
      } else if (u.field === 'defs[0].ex') {
        if (defs[0] && defs[0].ex === u.old) {
          defs[0].ex = u.new;
          modified = true;
        } else {
          console.warn(`Mismatch in ${wl} defs[0].ex`);
        }
      } else if (u.field === 'colloc[0].ex') {
        if (colloc[0] && colloc[0].ex === u.old) {
          colloc[0].ex = u.new;
          modified = true;
        } else {
          console.warn(`Mismatch in ${wl} colloc[0].ex`);
        }
      }
    }

    if (modified) {
      const defsStr = "'" + JSON.stringify(defs).replace(/'/g, "''") + "'";
      const collocStr = "'" + JSON.stringify(colloc).replace(/'/g, "''") + "'";
      const exStr = "'" + ex.replace(/'/g, "''") + "'";
      const wlStr = "'" + word_lanes.replace(/'/g, "''") + "'";
      const lemmaStr = "'" + lemma.replace(/'/g, "''") + "'";
      sql += `UPDATE entries SET word_lanes = ${wlStr}, lemma = ${lemmaStr}, example_sentence = ${exStr}, defs = ${defsStr}, colloc = ${collocStr} WHERE id = '${r.id}';\n`;
      updates++;
    }
  }

  fs.writeFileSync('apply_fixes.sql', sql);
  console.log(`Generated SQL for ${updates} entries.`);
} catch(e) {
  console.error(e);
}
