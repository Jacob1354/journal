CREATE TABLE IF NOT EXISTS day(
    id INTEGER PRIMARY KEY,
    update_timestamp INTEGER NOT NULL,
    username TEXT NOT NULL,
    date TEXT NOT NULL,
    UNIQUE (username, date),
    FOREIGN KEY (username) REFERENCES user(username) 
);

CREATE TABLE IF NOT EXISTS activity(
    id INTEGER PRIMARY KEY,
    day_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL, 
    FOREIGN KEY (day_id) REFERENCES day(id)
);

CREATE TABLE IF NOT EXISTS text_field(
    day_id INTEGER NOT NULL,
    arr_index INTEGER NOT NULL,
    title TEXT NOT NULL,
    data TEXT NULL,
    PRIMARY KEY (day_id, title),
    FOREIGN KEY (day_id) REFERENCES day(id),
    UNIQUE (day_id, arr_index)
);

CREATE TABLE IF NOT EXISTS number_field(
    day_id INTEGER NOT NULL,
    arr_index INTEGER NOT NULL,
    title TEXT NOT NULL,
    data REAL NOT NULL,
    PRIMARY KEY (day_id, title),
    FOREIGN KEY (day_id) REFERENCES day(id),
    UNIQUE (day_id, arr_index)
);

CREATE TABLE IF NOT EXISTS fraction_field(
    day_id INTEGER NOT NULL,
    arr_index INTEGER NOT NULL,
    title TEXT NOT NULL,
    data REAL NOT NULL,
    denominator INTEGER NOT NULL,
    PRIMARY KEY (day_id, title),
    FOREIGN KEY (day_id) REFERENCES day(id),
    UNIQUE (day_id, arr_index),
    CHECK (denominator > 0)
); 

CREATE TABLE IF NOT EXISTS slider_field(
    day_id INTEGER NOT NULL,
    arr_index INTEGER NOT NULL,
    title TEXT NOT NULL,
    data INTEGER NOT NULL,
    PRIMARY KEY (day_id, title),
    FOREIGN KEY (day_id) REFERENCES day(id),
    UNIQUE (day_id, arr_index),
    CHECK (data BETWEEN 0 AND 100)
);
