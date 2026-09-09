CREATE DATABASE IF NOT EXISTS scholarport;
USE scholarport;

CREATE TABLE articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    abstract TEXT,
    publication_date DATE,
    doi VARCHAR(255) UNIQUE,
    INDEX idx_title (title),
    INDEX idx_publication_date (publication_date)
) ENGINE=InnoDB;

CREATE TABLE authors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    INDEX idx_name (name)
) ENGINE=InnoDB;

CREATE TABLE citations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    citation_text TEXT NOT NULL
) ENGINE=InnoDB;

CREATE TABLE article_authors (
    article_id INT NOT NULL,
    author_id INT NOT NULL,
    PRIMARY KEY (article_id, author_id),
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE article_citations (
    article_id INT NOT NULL,
    citation_id INT NOT NULL,
    PRIMARY KEY (article_id, citation_id),
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
    FOREIGN KEY (citation_id) REFERENCES citations(id) ON DELETE CASCADE
) ENGINE=InnoDB;