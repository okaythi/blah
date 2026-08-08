const fs = require('fs');
const { execSync } = require('child_process');

const map = {
  "taas": { pos: "bw", morph: null },
  "ich": { pos: "vnw", morph: null },
  "mich": { pos: "vnw", morph: null },
  "oëg": { pos: "zn", morph: { gnd: "o", pl: "oëge", dim: "oëgske" } },
  "schoeën": { pos: "bn", morph: { vgr: "schoeëner", ovt: "schoeënste", verbuig: "schoeëne" } },
  "vèèrke": { pos: "zn", morph: { gnd: "o", pl: "vèèrkes", dim: "vèèrekske" } },
  "apattekèèr": { pos: "zn", morph: { gnd: "m", pl: "apattekèèrs", dim: "apattekèèrke" } },
  "aappel": { pos: "zn", morph: { gnd: "m", pl: "aappele", dim: "aappelke" } },
  "bees": { pos: "zn", morph: { gnd: "v", pl: "beze", dim: "beeske" } },
  "zjat": { pos: "zn", morph: { gnd: "v", pl: "zjatte", dim: "zjatje" } },
  "kaffe": { pos: "zn", morph: { gnd: "m", pl: "", dim: "" } },
  "pertang": { pos: "bw", morph: null },
  "valling": { pos: "zn", morph: { gnd: "v", pl: "vallinge", dim: "vallingske" } },
  "zieër": { pos: "zn", morph: { gnd: "o", pl: "", dim: "" } },
  "zèèver": { pos: "zn", morph: { gnd: "m", pl: "", dim: "" } },
  "pekes": { pos: "zn", morph: { gnd: "v", pl: "pekes", dim: "pekske" } },
  "pataat": { pos: "zn", morph: { gnd: "v", pl: "pataate", dim: "patatske" } },
  "nonk": { pos: "zn", morph: { gnd: "m", pl: "nonke", dim: "nonkske" } },
  "bomma": { pos: "zn", morph: { gnd: "v", pl: "bomma's", dim: "bommake" } },
  "bompa": { pos: "zn", morph: { gnd: "m", pl: "bompa's", dim: "bompake" } },
  "smout": { pos: "zn", morph: { gnd: "o", pl: "", dim: "" } },
  "zwanzen": { pos: "ww", morph: { sterk: false, conj: { "ich": "zwans", "gè": "zwanst", "hè": "zwanst", "we": "zwanzen", "gull": "zwanst", "zij": "zwanzen" }, vt: "zwanste", vd: "gezwansd" } },
  "schief": { pos: "bn", morph: { vgr: "schiever", ovt: "schiefste", verbuig: "schieve" } },
  "kastaar": { pos: "zn", morph: { gnd: "m", pl: "kastaars", dim: "kastaarke" } },
  "moos": { pos: "zn", morph: { gnd: "o", pl: "", dim: "" } },
  "talluur": { pos: "zn", morph: { gnd: "v", pl: "tallure", dim: "talluurke" } },
  "vorket": { pos: "zn", morph: { gnd: "v", pl: "vorkette", dim: "vorketsje" } },
  "lèpel": { pos: "zn", morph: { gnd: "m", pl: "lèpels", dim: "lèpelke" } },
  "mets": { pos: "zn", morph: { gnd: "o", pl: "metse", dim: "metske" } },
  "fret": { pos: "zn", morph: { gnd: "o", pl: "", dim: "" } },
  "schab": { pos: "zn", morph: { gnd: "o", pl: "schabbe", dim: "schabsje" } },
  "tes": { pos: "zn", morph: { gnd: "v", pl: "tesse", dim: "teske" } },
  "klak": { pos: "zn", morph: { gnd: "v", pl: "klakke", dim: "klakske" } },
  "blaag": { pos: "zn", morph: { gnd: "o", pl: "blage", dim: "blaagske" } },
  "menneke": { pos: "zn", morph: { gnd: "o", pl: "mennekes", dim: "menneke" } },
  "maske": { pos: "zn", morph: { gnd: "o", pl: "maskes", dim: "maske" } },
  "boëte": { pos: "bw", morph: null },
  "binne": { pos: "bw", morph: null },
  "boë": { pos: "vnw", morph: null },
  "wanniër": { pos: "bw", morph: null },
  "wa": { pos: "vnw", morph: null },
  "goën": { pos: "ww", morph: { sterk: true, conj: { "ich": "gon", "gè": "goot", "hè": "geet", "we": "gën", "gull": "goot", "zij": "gën" }, vt: "ging", vd: "gegoën" } },
  "doën": { pos: "ww", morph: { sterk: true, conj: { "ich": "doen", "gè": "doot", "hè": "doe", "we": "doën", "gull": "doot", "zij": "doën" }, vt: "dee", vd: "gedoën" } },
  "loëte": { pos: "ww", morph: { sterk: true, conj: { "ich": "loat", "gè": "loët", "hè": "lët", "we": "loëte", "gull": "loët", "zij": "loëte" }, vt: "liet", vd: "geloëte" } },
  "slage": { pos: "ww", morph: { sterk: true, conj: { "ich": "sloag", "gè": "sloëgt", "hè": "slët", "we": "slage", "gull": "sloëgt", "zij": "slage" }, vt: "sloeg", vd: "geslage" } },
  "zien": { pos: "ww", morph: { sterk: true, conj: { "ich": "zien", "gè": "zeet", "hè": "ziet", "we": "zien", "gull": "zeet", "zij": "zien" }, vt: "zaag", vd: "gezieë" } },
  "hèère": { pos: "ww", morph: { sterk: false, conj: { "ich": "hèèr", "gè": "hèèrt", "hè": "hèèrt", "we": "hèère", "gull": "hèèrt", "zij": "hèère" }, vt: "hoeërde", vd: "gehoeërd" } },
  "kaud": { pos: "bn", morph: { vgr: "kauder", ovt: "kaudste", verbuig: "kaude" } },
  "wèèrem": { pos: "bn", morph: { vgr: "wèèremer", ovt: "wèèremste", verbuig: "wèèreme" } },
  "bèd": { pos: "zn", morph: { gnd: "o", pl: "bèdde", dim: "bedsje" } },
  "vèèr": { pos: "bn", morph: { vgr: "veier", ovt: "veiste", verbuig: "vèère" } },
  "kort": { pos: "bn", morph: { vgr: "korter", ovt: "kortste", verbuig: "korte" } },
  "groeët": { pos: "bn", morph: { vgr: "groeëter", ovt: "groeëtste", verbuig: "groeëte" } },
  "klèèn": { pos: "bn", morph: { vgr: "klèèner", ovt: "klèènste", verbuig: "klèène" } },
  "dik": { pos: "bn", morph: { vgr: "dikker", ovt: "dikste", verbuig: "dikke" } },
  "ambras": { pos: "zn", morph: { gnd: "m", pl: "", dim: "" } },
  "bèk": { pos: "zn", morph: { gnd: "m", pl: "bèkke", dim: "bèkske" } },
  "biezem": { pos: "zn", morph: { gnd: "m", pl: "biezems", dim: "biezemke" } },
  "bokes": { pos: "zn", morph: { gnd: "o", pl: "bokes", dim: "boke" } },
  "drèts": { pos: "zn", morph: { gnd: "v", pl: "", dim: "" } },
  "gezèt": { pos: "zn", morph: { gnd: "v", pl: "gezètte", dim: "gezètsje" } },
  "gommel": { pos: "zn", morph: { gnd: "m", pl: "", dim: "" } },
  "hès": { pos: "bn", morph: { vgr: "hèsser", ovt: "hèsste", verbuig: "hèsse" } },
  "jengelen": { pos: "ww", morph: { sterk: false, conj: { "ich": "jengel", "gè": "jengelt", "hè": "jengelt", "we": "jengelen", "gull": "jengelt", "zij": "jengelen" }, vt: "jengelde", vd: "gejengeld" } },
  "kwèèzel": { pos: "zn", morph: { gnd: "v", pl: "kwèèzels", dim: "kwèèzelke" } },
  "labberkak": { pos: "zn", morph: { gnd: "m", pl: "labberkakken", dim: "labberkakske" } },
  "plak": { pos: "zn", morph: { gnd: "v", pl: "plakke", dim: "plakske" } },
  "poeës": { pos: "zn", morph: { gnd: "v", pl: "poeëze", dim: "poeëske" } },
  "sjette": { pos: "ww", morph: { sterk: false, conj: { "ich": "sjet", "gè": "sjèt", "hè": "sjèt", "we": "sjette", "gull": "sjèt", "zij": "sjette" }, vt: "sjette", vd: "gesjet" } },
  "sjottel": { pos: "zn", morph: { gnd: "v", pl: "sjottels", dim: "sjottelke" } },
  "toet": { pos: "zn", morph: { gnd: "m", pl: "toete", dim: "toetsje" } },
  "zjiever": { pos: "zn", morph: { gnd: "m", pl: "", dim: "" } },
  "zwègel": { pos: "zn", morph: { gnd: "m", pl: "zwègels", dim: "zwègelke" } },
  "bleèren": { pos: "ww", morph: { sterk: false, conj: { "ich": "bleèr", "gè": "bleèrt", "hè": "bleèrt", "we": "bleèren", "gull": "bleèrt", "zij": "bleèren" }, vt: "bleèrde", vd: "gebleèrd" } },
  "kluut": { pos: "zn", morph: { gnd: "m", pl: "klute", dim: "kluutsje" } },
  "appelsien": { pos: "zn", morph: { gnd: "m", pl: "appelsiene", dim: "appelsienke" } },
  "kaffee": { pos: "zn", morph: { gnd: "o", pl: "kaffees", dim: "kaffeeke" } },
  "pintje": { pos: "zn", morph: { gnd: "o", pl: "pintjes", dim: "pintje" } },
  "boeëk": { pos: "zn", morph: { gnd: "m", pl: "boeke", dim: "boeëkske" } },
  "scheel": { pos: "zn", morph: { gnd: "o", pl: "schele", dim: "scheeltje" } },
  "kletskop": { pos: "zn", morph: { gnd: "m", pl: "kletskoppe", dim: "kletskopske" } },
  "smoël": { pos: "zn", morph: { gnd: "m", pl: "smoële", dim: "smoëlke" } },
  "vandoag": { pos: "bw", morph: null },
  "mèèrege": { pos: "zn", morph: { gnd: "m", pl: "mèèrege", dim: "mèèrekske" } },
  "giestere": { pos: "bw", morph: null },
  "vrieë": { pos: "bw", morph: null },
  "kiekot": { pos: "zn", morph: { gnd: "o", pl: "kiekotte", dim: "kiekotje" } },
  "eike": { pos: "zn", morph: { gnd: "o", pl: "eikes", dim: "eike" } },
  "spek": { pos: "zn", morph: { gnd: "o", pl: "spekken", dim: "spekske" } },
  "nief": { pos: "bn", morph: { vgr: "niever", ovt: "niefste", verbuig: "nieve" } },
  "aad": { pos: "bn", morph: { vgr: "aader", ovt: "aatste", verbuig: "aade" } },
  "oto": { pos: "zn", morph: { gnd: "m", pl: "oto's", dim: "otooke" } },
  "veloo": { pos: "zn", morph: { gnd: "m", pl: "veloo's", dim: "velooke" } },
  "wèèrek": { pos: "zn", morph: { gnd: "o", pl: "wèèreke", dim: "wèèrekske" } },
  "zwat": { pos: "bn", morph: { vgr: "zwatter", ovt: "zwatste", verbuig: "zwatte" } },
  "ruuëd": { pos: "bn", morph: { vgr: "ruuëder", ovt: "ruuëtste", verbuig: "ruuëde" } },
  "gieël": { pos: "bn", morph: { vgr: "gieëler", ovt: "gieëlste", verbuig: "gieële" } },
  "zoeët": { pos: "bn", morph: { vgr: "zoeëter", ovt: "zoeëtste", verbuig: "zoeëte" } },
  "zoer": { pos: "bn", morph: { vgr: "zoerder", ovt: "zoerste", verbuig: "zoere" } },
  "zat": { pos: "bn", morph: { vgr: "zatter", ovt: "zatste", verbuig: "zatte" } },
  "noen": { pos: "zn", morph: { gnd: "m", pl: "noene", dim: "noenke" } },
  "graaf": { pos: "bn", morph: { vgr: "graver", ovt: "graafste", verbuig: "grave" } },
  "krapuul": { pos: "zn", morph: { gnd: "o", pl: "", dim: "" } },
  "lomp": { pos: "bn", morph: { vgr: "lomper", ovt: "lompste", verbuig: "lompe" } },
  "stoeffer": { pos: "zn", morph: { gnd: "m", pl: "stoeffers", dim: "stoefferke" } },
  "cente": { pos: "zn", morph: { gnd: "m", pl: "cente", dim: "centske" } },
  "mèèrt": { pos: "zn", morph: { gnd: "v", pl: "mèèrte", dim: "mèèrtsje" } },
  "gèt": { pos: "vnw", morph: null },
  "rap": { pos: "bn", morph: { vgr: "rapper", ovt: "rapste", verbuig: "rappe" } },
  "proëper": { pos: "bn", morph: { vgr: "proëperder", ovt: "proëperste", verbuig: "proëpere" } },
  "zjwemme": { pos: "ww", morph: { sterk: false, conj: { "ich": "zjwem", "gè": "zjwemt", "hè": "zjwemt", "we": "zjwemme", "gull": "zjwemt", "zij": "zjwemme" }, vt: "zjwemde", vd: "gezjwemd" } }
};

try {
  console.log("Fetching DB data...");
  // Use powershell or raw exec, capturing stdout only.
  const rawData = execSync('npx wrangler d1 execute DB --remote --command "SELECT id, word_lanes FROM entries" --json', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
  
  // Try to parse out the JSON. Wrangler might output some log lines at the top.
  const jsonStart = rawData.indexOf('[');
  const jsonEnd = rawData.lastIndexOf(']');
  const jsonStr = rawData.substring(jsonStart, jsonEnd + 1);
  const data = JSON.parse(jsonStr);
  const rows = data[0].results;
  
  let sql = '';
  let updated = 0;
  for (const r of rows) {
    const wl = r.word_lanes;
    const match = map[wl];
    if (match) {
      const morphStr = match.morph ? JSON.stringify(match.morph) : null;
      sql += `UPDATE entries SET pos = '${match.pos}', morph = ${morphStr ? "'" + morphStr.replace(/'/g, "''") + "'" : 'NULL'} WHERE id = '${r.id}';\n`;
      updated++;
    }
  }
  
  fs.writeFileSync('migration_retro.sql', sql);
  console.log('Migration generated. Added updates for ' + updated + ' rows.');
} catch(e) {
  console.error("Error:", e);
}
