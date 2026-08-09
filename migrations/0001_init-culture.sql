-- Migration number: 0001 	 2026-08-09T04:04:32.532Z

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
