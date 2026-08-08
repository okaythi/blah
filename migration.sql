ALTER TABLE entries ADD COLUMN lemma TEXT;
ALTER TABLE entries ADD COLUMN broad_ipa TEXT;
ALTER TABLE entries ADD COLUMN narrow_ipa TEXT;
ALTER TABLE entries ADD COLUMN audio_url TEXT;
ALTER TABLE entries ADD COLUMN pos TEXT;
ALTER TABLE entries ADD COLUMN tone TEXT;
ALTER TABLE entries ADD COLUMN morph TEXT;
ALTER TABLE entries ADD COLUMN defs TEXT;
ALTER TABLE entries ADD COLUMN colloc TEXT;
ALTER TABLE entries ADD COLUMN register TEXT;
ALTER TABLE entries ADD COLUMN entry_status TEXT DEFAULT 'actief';
ALTER TABLE entries ADD COLUMN etym TEXT;

CREATE TABLE IF NOT EXISTS cross_refs (
  id TEXT PRIMARY KEY,
  src_id TEXT NOT NULL,
  tgt_id TEXT NOT NULL,
  rel TEXT NOT NULL,
  FOREIGN KEY(src_id) REFERENCES entries(id),
  FOREIGN KEY(tgt_id) REFERENCES entries(id)
);

UPDATE entries SET lemma = word_lanes WHERE lemma IS NULL;
UPDATE entries SET broad_ipa = ipa WHERE broad_ipa IS NULL;
UPDATE entries SET entry_status = 'actief' WHERE entry_status IS NULL;
UPDATE entries SET register = 'informeel' WHERE register IS NULL;

DROP TRIGGER IF EXISTS entries_ai;
DROP TRIGGER IF EXISTS entries_ad;
DROP TRIGGER IF EXISTS entries_au;
DROP TABLE IF EXISTS entries_fts;

CREATE VIRTUAL TABLE entries_fts USING fts5(
    word_lanes,
    word_nl,
    lemma,
    entry_id UNINDEXED
);

INSERT INTO entries_fts(word_lanes, word_nl, lemma, entry_id)
  SELECT word_lanes, word_nl, lemma, id FROM entries;

CREATE TRIGGER entries_ai AFTER INSERT ON entries BEGIN
  INSERT INTO entries_fts(word_lanes, word_nl, lemma, entry_id)
    VALUES (new.word_lanes, new.word_nl, new.lemma, new.id);
END;

CREATE TRIGGER entries_ad AFTER DELETE ON entries BEGIN
  DELETE FROM entries_fts WHERE rowid =
    (SELECT rowid FROM entries_fts WHERE entry_id = old.id);
END;

CREATE TRIGGER entries_au AFTER UPDATE ON entries BEGIN
  DELETE FROM entries_fts WHERE rowid =
    (SELECT rowid FROM entries_fts WHERE entry_id = old.id);
  INSERT INTO entries_fts(word_lanes, word_nl, lemma, entry_id)
    VALUES (new.word_lanes, new.word_nl, new.lemma, new.id);
END;
