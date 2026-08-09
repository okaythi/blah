const fs = require('fs');

try {
  let raw = fs.readFileSync('db_dump_for_audit.json', 'utf16le');
  raw = raw.replace(/^\uFEFF/, '');
  const jsonStart = raw.indexOf('[');
  const jsonEnd = raw.lastIndexOf(']');
  const jsonStr = raw.substring(jsonStart, jsonEnd + 1);
  const data = JSON.parse(jsonStr)[0].results;

  const srcs = new Set();
  let sql = '';
  let updates = 0;

  for (const r of data) {
    let modified = false;
    let defs = [];
    try { defs = JSON.parse(r.defs || "[]"); } catch(e) {}
    
    for (let i = 0; i < defs.length; i++) {
      if (defs[i].src) {
        srcs.add(defs[i].src);
        if (defs[i].src.toLowerCase().includes('discord') || defs[i].src.toLowerCase().includes('masterlist')) {
           delete defs[i].src;
           modified = true;
        }
      }
    }

    if (modified) {
      const defsStr = "'" + JSON.stringify(defs).replace(/'/g, "''") + "'";
      sql += `UPDATE entries SET defs = ${defsStr} WHERE id = '${r.id}';\n`;
      updates++;
    }
  }

  console.log("Found existing sources before cleanup:", Array.from(srcs));
  fs.writeFileSync('remove_src.sql', sql);
  console.log(`Generated SQL to remove informal sources for ${updates} entries.`);
} catch(e) {
  console.error(e);
}
