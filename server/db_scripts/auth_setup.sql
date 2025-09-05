CREATE TABLE IF NOT EXISTS user(
    username TEXT PRIMARY KEY NOT NULL,
    hash TEXT NOT NULL,
    name TEXT NOT NULL
) WITHOUT ROWID;

CREATE TABLE IF NOT EXISTS session(
    session TEXT UNIQUE  NOT NULL,
    username TEXT NOT NULL,
    delete_time INTEGER NOT NULL,
    PRIMARY KEY (session, username),
    FOREIGN KEY (username) REFERENCES user(username)
);
