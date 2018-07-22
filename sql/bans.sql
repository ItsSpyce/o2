CREATE TABLE IF NOT EXISTS Bans (
    steam_id TINYTEXT NOT NULL,
    banned_by_id TINYTEXT NOT NULL,
    reason TINYTEXT NOT NULL,
    enforced_on INT NOT NULL,
    duration INT NOT NULL
)