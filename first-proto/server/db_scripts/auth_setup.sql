CREATE TABLE IF NOT EXISTS user(
    username TEXT PRIMARY KEY,
    password TEXT NOT NULL,
    name TEXT NOT NULL
) WITHOUT ROWID;

CREATE TABLE IF NOT EXISTS session(
    session TEXT,
    username TEXT,
    PRIMARY KEY (session, username),
    FOREIGN KEY (username) REFERENCES user(username)
);
