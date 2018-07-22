CREATE TABLE IF NOT EXISTS PV (
    steam_id TINYTEXT NOT NULL,
    killer_id TINYTEXT NULL,
    death_date INTEGER NOT NULL,
    reason TINYTEXT NOT NULL,
    from_player BIT NOT NULL
)