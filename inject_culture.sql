CREATE TABLE IF NOT EXISTS culture_audios (
    id TEXT PRIMARY KEY,
    audio_url TEXT NOT NULL,
    caption TEXT,
    created_at INTEGER NOT NULL
);

INSERT INTO culture_facts (id, fact, created_at) VALUES 
('fact_1', 'Pippin of Landen (c. 580 – 640), also known as Pippin the Elder, was not a Merovingian king himself, but the Mayor of the Palace of Austrasia. He essentially ruled behind the scenes and founded the dynasty that would eventually displace the Merovingians.', strftime('%s', 'now')),
('fact_2', 'The Ingvaeonic nasal spirant law is a historical linguistic shift that shaped local dialects. It caused the loss of ''n'' or ''m'' before fricatives like ''f'' or ''s''. This is why the Dutch and local dialect word is ''vijf'' (five), while German retained the older nasal form ''fünf''.', strftime('%s', 'now') + 1),
('fact_3', 'Landen railway station opened on 2 April 1838. It is one of the oldest railway stations in Belgium and played a pivotal role in the region''s economic development and the spread of linguistic influences.', strftime('%s', 'now') + 2);
