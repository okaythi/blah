CREATE TABLE entries (
    id TEXT PRIMARY KEY,
    word_lanes TEXT NOT NULL,
    ipa TEXT,
    word_nl TEXT NOT NULL,
    example_sentence TEXT,
    additional_metadata TEXT
);

CREATE VIRTUAL TABLE entries_fts USING fts5(
    word_lanes,
    word_nl,
    entry_id UNINDEXED
);

CREATE TRIGGER entries_ai AFTER INSERT ON entries BEGIN
  INSERT INTO entries_fts(word_lanes, word_nl, entry_id) VALUES (new.word_lanes, new.word_nl, new.id);
END;
CREATE TRIGGER entries_ad AFTER DELETE ON entries BEGIN
  DELETE FROM entries_fts WHERE rowid = (SELECT rowid FROM entries_fts WHERE entry_id = old.id);
END;
CREATE TRIGGER entries_au AFTER UPDATE ON entries BEGIN
  DELETE FROM entries_fts WHERE rowid = (SELECT rowid FROM entries_fts WHERE entry_id = old.id);
  INSERT INTO entries_fts(word_lanes, word_nl, entry_id) VALUES (new.word_lanes, new.word_nl, new.id);
END;

CREATE TABLE admin_users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
);

CREATE TABLE passkeys (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    public_key TEXT NOT NULL,
    sign_count INTEGER NOT NULL,
    FOREIGN KEY(user_id) REFERENCES admin_users(id)
);

CREATE TABLE sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    expires_at INTEGER NOT NULL,
    FOREIGN KEY(user_id) REFERENCES admin_users(id)
);

CREATE TABLE culture_facts (
    id TEXT PRIMARY KEY,
    fact TEXT NOT NULL,
    created_at INTEGER NOT NULL
);

CREATE TABLE culture_images (
    id TEXT PRIMARY KEY,
    image_url TEXT NOT NULL,
    caption TEXT,
    created_at INTEGER NOT NULL
);
