CREATE TABLE IF NOT EXISTS activity(
    id INTEGER PRIMARY KEY,
    day_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL, 
    FOREIGN KEY (day_id) REFERENCES day(id)
);

CREATE TABLE day(
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL,
    date TEXT NOT NULL,
    UNIQUE (username, date),
    FOREIGN KEY (username) REFERENCES user(username) 
)

CREATE TABLE text_field(
    day_id INTEGER
        NOT NULL
        REFERENCES day(id),
    arr_index INTEGER NOT NULL,
    title TEXT NOT NULL,
    data TEXT NULL,
    PRIMARY KEY (day_id, title),
    UNIQUE (day_id, arr_index)
);

CREATE TABLE number_field(
    day_id INTEGER
        NOT NULL
        REFERENCES day(id),
    arr_index INTEGER NOT NULL,
    title TEXT NOT NULL,
    data REAL NOT NULL,
    PRIMARY KEY (day_id, title),
    UNIQUE (day_id, arr_index)
    
);

CREATE TABLE fraction_field(
    day_id INTEGER
        NOT NULL
        REFERENCES day(id),
    arr_index INTEGER NOT NULL,
    title TEXT NOT NULL,
    data REAL NOT NULL,
    denominator INTEGER NOT NULL,
    PRIMARY KEY (day_id, title),
    UNIQUE (day_id, arr_index)
); 

CREATE TABLE slider_field(
    day_id INTEGER
        NOT NULL
        REFERENCES day(id),
    arr_index INTEGER NOT NULL,
    title TEXT NOT NULL,
    data INTEGER NOT NULL
        CHECK (data BETWEEN 0 AND 100),
    PRIMARY KEY (day_id, title),
    UNIQUE (day_id, arr_index)
);
