const fs = require('fs');

try {
  const rawData = fs.readFileSync('additions.json', 'utf8');
  const items = JSON.parse(rawData);
  
  let sql = '';
  
  for (const item of items) {
    const id = item.id;
    const wl = (item.word_lanes || "").replace(/'/g, "''");
    const lemma = (item.lemma || "").replace(/'/g, "''");
    const wnl = (item.word_nl || "").replace(/'/g, "''");
    const ex = (item.example_sentence || "").replace(/'/g, "''");
    const ipa = (item.ipa || "").replace(/'/g, "''");
    const bipa = (item.broad_ipa || "").replace(/'/g, "''");
    const nipa = (item.narrow_ipa || "").replace(/'/g, "''");
    const aud = (item.audio_url || "").replace(/'/g, "''");
    const tone = (item.tone || "").replace(/'/g, "''");
    const pos = (item.pos || "");
    const reg = (item.register || "informeel");
    const sts = (item.entry_status || "actief");
    const etym = (item.etym || "").replace(/'/g, "''");
    const am = (item.additional_metadata || "").replace(/'/g, "''");
    
    // JSON objects
    const morph = Object.keys(item.morph || {}).length > 0 ? "'" + JSON.stringify(item.morph).replace(/'/g, "''") + "'" : "NULL";
    const defs = item.defs && item.defs.length > 0 ? "'" + JSON.stringify(item.defs).replace(/'/g, "''") + "'" : "'[]'";
    const colloc = item.colloc && item.colloc.length > 0 ? "'" + JSON.stringify(item.colloc).replace(/'/g, "''") + "'" : "'[]'";

    sql += `INSERT INTO entries (id, word_lanes, lemma, ipa, broad_ipa, narrow_ipa, audio_url, word_nl, example_sentence, pos, tone, morph, defs, colloc, register, entry_status, etym, additional_metadata) VALUES ('${id}', '${wl}', '${lemma}', '${ipa}', '${bipa}', '${nipa}', '${aud}', '${wnl}', '${ex}', '${pos}', '${tone}', ${morph}, ${defs}, ${colloc}, '${reg}', '${sts}', '${etym}', '${am}');\n`;
    
    if (item.xrefs && item.xrefs.length > 0) {
      for (const xref of item.xrefs) {
        sql += `INSERT INTO cross_refs (id, src_id, tgt_id, rel) VALUES ('${xref.id}', '${xref.src_id}', '${xref.tgt_id}', '${xref.rel}');\n`;
      }
    }
  }
  
  fs.writeFileSync('additions.sql', sql);
  console.log('SQL additions generated for ' + items.length + ' entries.');
} catch(e) {
  console.error(e);
}
