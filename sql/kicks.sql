CREATE TABLE IF NOT EXISTS Kicks (
    steam_id TINYTEXT NOT NULL,
    kicked_by_id TINYTEXT NOT NULL,
    reason TINYTEXT NOT NULL,
    enforced_on INT NOT NULL
)