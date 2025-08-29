CREATE TABLE IF NOT EXISTS activity(
    username TEXT,
    date TEXT,
    title TEXT 
        DEFAULT 'Activity' NOT NULL,
    content TEXT 
        DEFAULT 'Content' NOT NULL,
    start_time TEXT 
        DEFAULT '10:00' NOT NULL,
    end_time TEXT 
        DEFAULT '14:00' NOT NULL,
    PRIMARY KEY (username, date),
    FOREIGN KEY (username) REFERENCES user(username)
);

CREATE TABLE mood_fields(
    id PRIMARY KEY,
    username NOT NULL,
    date TEXT NOT NULL,
    UNIQUE (username, date),
    FOREIGN KEY (username) REFERENCES user(username) 
);

CREATE TABLE text_field(
    mood_fields_id
        NOT NULL
        REFERENCES mood_field(id),
    title TEXT PRIMARY KEY,
    field_data TEXT 
        DEFAULT '' NOT NULL
);

CREATE TABLE number_field(
    mood_fields_id INTEGER
        NOT NULL
        REFERENCES mood_field(id),
    title TEXT PRIMARY KEY,
    field_data REAL 
        DEFAULT 0 NOT NULL
);

CREATE TABLE fraction_field(
    mood_fields_id INTEGER
        NOT NULL
        REFERENCES mood_field(id),
    title TEXT PRIMARY KEY,
    field_data REAL 
        DEFAULT 0 NOT NULL,
    denominator INTEGER 
        DEFAULT 10 NOT NULL
); 

CREATE TABLE slider_field(
    mood_fields_id INTEGER
        NOT NULL
        REFERENCES mood_field(id),
    title TEXT PRIMARY KEY,
    field_data INTEGER 
        DEFAULT 0 NOT NULL
        CHECK (field_data BETWEEN 0 AND 100)
);
