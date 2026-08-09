const fs = require('fs');

try {
  const raw = fs.readFileSync('db_dump_for_audit.json', 'utf16le');
  // extract json array from wrangler output
  const jsonStart = raw.indexOf('[');
  const jsonEnd = raw.lastIndexOf(']');
  const jsonStr = raw.substring(jsonStart, jsonEnd + 1);
  const data = JSON.parse(jsonStr)[0].results;

  // Build a map of Standard Dutch -> Dialect
  // We only care about words that are distinctly different.
  const nlToLanes = {};
  for (const r of data) {
    const nlWords = r.word_nl.split('/').map(s => s.trim().toLowerCase());
    const lanes = r.word_lanes.toLowerCase();
    
    for (const nl of nlWords) {
      if (nl !== lanes && nl.length > 2 && !nl.includes(' ')) {
        // Only map if it's distinctly different and a single word
        nlToLanes[nl] = lanes;
      }
    }
  }

  // Force specific common words for aggressive checking based on known dictionary
  const forcedMap = {
    "thuis": "taas",
    "ik": "ich",
    "mij": "mich",
    "mijn": "mnen",
    "jij": "gè",
    "hij": "hè",
    "wij": "we",
    "jullie": "gull",
    "zij": "zij",
    "maar": "mor",
    "ook": "oech",
    "gewoon": "gwn",
    "niet": "ni",
    "wel": "wel",
    "zo": "zoeë",
    "een": "ne/nen/e",
    "heel": "iel",
    "helemaal": "ieëlemoal",
    "hebben": "emme",
    "zijn": "zen",
    "wat": "wa"
  };

  const checkMap = { ...nlToLanes, ...forcedMap };
  const issues = [];

  // Function to scan a sentence for NL words that should be dialect
  function scanSentence(entryLanes, entryId, sentence, sourceField) {
    if (!sentence) return;
    
    // We only want to flag sentences that are supposed to be in dialect.
    // Usually example sentences are in dialect.
    const words = sentence.replace(/[.,!?"]/g, '').toLowerCase().split(/\s+/);
    
    for (const w of words) {
      if (checkMap[w] && checkMap[w] !== entryLanes.toLowerCase()) {
        issues.push({
          id: entryId,
          entry: entryLanes,
          field: sourceField,
          sentence: sentence,
          found_nl: w,
          should_be: checkMap[w]
        });
      }
    }
  }

  for (const r of data) {
    scanSentence(r.word_lanes, r.id, r.example_sentence, 'example_sentence');
    
    let defs = [];
    try { defs = JSON.parse(r.defs || "[]"); } catch (e) {}
    for (let i = 0; i < defs.length; i++) {
      scanSentence(r.word_lanes, r.id, defs[i].ex, `defs[${i}].ex`);
    }

    let colloc = [];
    try { colloc = JSON.parse(r.colloc || "[]"); } catch (e) {}
    for (let i = 0; i < colloc.length; i++) {
      scanSentence(r.word_lanes, r.id, colloc[i].ex, `colloc[${i}].ex`);
    }
  }

  fs.writeFileSync('audit_results.json', JSON.stringify(issues, null, 2));
  console.log(`Found ${issues.length} potential inconsistencies.`);
} catch (e) {
  console.error(e);
}
