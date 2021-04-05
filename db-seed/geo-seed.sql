INSERT INTO users
    (username, password, first_name, last_name, email)
VALUES
    ('sandy',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test',
        'User',
        'sandy@gmail.com'),
    ('fergus',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test',
        'Admin!',
        'fergus@gmail.com');

INSERT INTO highscores
    (username, highscore)
VALUES
    ('sandy', 1000),
    ('fergus', 900)
