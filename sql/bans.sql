CREATE TABLE Bans (
    steam_id TEXT NOT NULL,
    banned_by_id TEXT NOT NULL,
    reason TEXT NOT NULL,
    enforced_on INT NOT NULL,
    duration INT NOT NULL
)