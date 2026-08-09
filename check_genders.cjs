const fs = require('fs');

const raw = fs.readFileSync('db_dump_for_audit.json', 'utf16le');
const jsonStart = raw.indexOf('[');
const jsonEnd = raw.lastIndexOf(']');
const jsonStr = raw.substring(jsonStart, jsonEnd + 1);
const data = JSON.parse(jsonStr)[0].results;

const words = ['kastaar', 'menneke', 'kwèèzel', 'kaffee', 'eike', 'nief', 'poeës', 'masjien', 'veroal', 'blaag'];

for (const r of data) {
  if (words.includes(r.word_lanes)) {
    let morph = {};
    try { morph = JSON.parse(r.morph || '{}'); } catch(e) {}
    console.log(`${r.word_lanes}: pos=${r.pos}, gnd=${morph.gnd}`);
  }
}
