DROP TABLE text_field;
DROP TABLE number_field;
DROP TABLE fraction_field;
DROP TABLE slider_field;
DROP VIEW activity_view;
DROP TABLE activity;
DROP TABLE mood_field;
DROP TABLE day;




CREATE TABLE day (
    day_date DATE PRIMARY KEY
);

CREATE TABLE activity(
    id SERIAL PRIMARY KEY,
    day_date DATE 
        REFERENCES day(day_date),
    title TEXT 
        DEFAULT 'Activity' NOT NULL,
    content TEXT 
        DEFAULT 'Content' NOT NULL,
    start_time TIME 
        DEFAULT '10:00:00' NOT NULL,
    end_time TIME 
        DEFAULT '14:00:00' NOT NULL
);

CREATE TABLE mood_field(
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL
);

CREATE TABLE text_field(
    id INTEGER PRIMARY KEY 
        REFERENCES mood_field(id),
    field_data TEXT 
        DEFAULT '' NOT NULL
);

CREATE TABLE number_field(
    id INTEGER PRIMARY KEY REFERENCES mood_field(id),
    field_data REAL 
        DEFAULT 0 NOT NULL
);

CREATE TABLE fraction_field(
    id INTEGER PRIMARY KEY REFERENCES mood_field(id),
    field_data REAL 
        DEFAULT 0 NOT NULL,
    denominator INTEGER 
        DEFAULT 10 NOT NULL
); 

CREATE TABLE slider_field(
    id INTEGER PRIMARY KEY REFERENCES mood_field(id),
    field_data INTEGER 
        DEFAULT 0 NOT NULL
        CHECK (field_data BETWEEN 0 AND 100)
);
