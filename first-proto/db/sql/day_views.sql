CREATE VIEW activity_view AS
    SELECT  title,
            content,
            to_char(start_time, 'HH24:MI') AS start_time,
            to_char(end_time, 'HH24:MI') AS end_time
    FROM activity;
        