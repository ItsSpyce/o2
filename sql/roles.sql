CREATE TABLE Roles (
    steam_id TEXT NOT NULL,
    player_role INTEGER DEFAULT 0,
    PRIMARY KEY(steam_id)
)