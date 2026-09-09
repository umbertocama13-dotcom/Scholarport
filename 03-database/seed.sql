USE scholarport;

INSERT INTO articles (title, abstract, publication_date, doi) VALUES
('Intro to SQL', 'A beginner article about SQL databases.', '2024-01-10', '10.1000/sql1'),
('Data Modeling Basics', 'An article about relational design.', '2024-02-15', '10.1000/sql2');

INSERT INTO authors (name) VALUES
('Alice Brown'),
('Marco Rossi');

INSERT INTO citations (citation_text) VALUES
('Smith et al. 2020'),
('Johnson and Lee 2021');

INSERT INTO article_authors (article_id, author_id) VALUES
(1, 1),
(1, 2),
(2, 2);

INSERT INTO article_citations (article_id, citation_id) VALUES
(1, 1),
(1, 2),
(2, 1);