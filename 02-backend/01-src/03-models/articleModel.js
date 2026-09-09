// importo il pool di connessioni
const pool = require('../db');

// importo le funzioni già pronte per autori e citazioni
const { findOrCreateAuthor } = require('./authorModel');



// ==================================================================================================
// LETTURA

// recupera tutti gli articoli (senza autori/citazioni, quelli si recuperano a parte con getArticleAuthors / getArticleCitations)
async function getAllArticles() {
  const [rows] = await pool.query(
    'SELECT id, title, abstract, publication_date, doi FROM articles ORDER BY publication_date DESC'
  );
  return rows;
}


// recupera un singolo articolo dato il suo id
async function getArticleById(id) {
  const [rows] = await pool.query(
    'SELECT id, title, abstract, publication_date, doi FROM articles WHERE id = ?',
    [id]
  );

  return rows.length > 0 ? rows[0] : null;
}


// cerca un articolo tramite DOI esatto
async function findArticleByDoi(doi) {
  const [rows] = await pool.query(
    'SELECT id, title, abstract, publication_date, doi FROM articles WHERE doi = ?',
    [doi]
  );

  return rows.length > 0 ? rows[0] : null;
}


// cerca articoli il cui titolo CONTIENE il testo passato (ricerca parziale)
// uso LIKE con i "%" per permettere corrispondenze parziali, non solo esatte (es. cercando "sql" trova anche "Intro to SQL")
async function findArticleByTitle(title) {
  const [rows] = await pool.query(
    'SELECT id, title, abstract, publication_date, doi FROM articles WHERE title LIKE ?',
    [`%${title}%`]
  );

  return rows;
}


// cerca articoli pubblicati in un anno specifico
async function findArticleByYear(year) {
  const [rows] = await pool.query(
    'SELECT id, title, abstract, publication_date, doi FROM articles WHERE YEAR(publication_date) = ?',
    [year]
  );

  return rows;
}


// cerca articoli scritti da un autore il cui nome CONTIENE il testo passato
// (ricerca parziale, coerente con lo stile già usato per findArticleByTitle)
async function findArticleByAuthor(authorName) {
  const [rows] = await pool.query(
    `SELECT DISTINCT articles.id, articles.title, articles.abstract, articles.publication_date, articles.doi
     FROM articles
     JOIN article_authors ON articles.id = article_authors.article_id
     JOIN authors ON authors.id = article_authors.author_id
     WHERE authors.name LIKE ?`,
    [`%${authorName}%`]
  );

  return rows;
}


// recupera tutti gli autori collegati a un articolo specifico
// si usa una JOIN: "article_authors" (la tabella ponte) con "authors",
async function getArticleAuthors(articleId) {
  const [rows] = await pool.query(
    `SELECT authors.id, authors.name
     FROM authors
     JOIN article_authors ON authors.id = article_authors.author_id
     WHERE article_authors.article_id = ?`,
    [articleId]
  );

  return rows;
}


// recupera tutte le citazioni collegate a un articolo specifico
// si usa join per usare la tabella ponte
async function getArticleCitations(articleId) {
  const [rows] = await pool.query(
    `SELECT citations.id, citations.citation_text
     FROM citations
     JOIN article_citations ON citations.id = article_citations.citation_id
     WHERE article_citations.article_id = ?`,
    [articleId]
  );

  return rows;
}



// =========================================================================================================
// COLLEGAMENTI (tabelle ponte)

// collega un autore (già esistente, tramite authorId) a un articolo
// "executor" è di default il pool normale; se necessario si usa una connessione di transazione
async function linkAuthorToArticle(articleId, authorId, executor = pool) {
  await executor.query(
    'INSERT INTO article_authors (article_id, author_id) VALUES (?, ?)',
    [articleId, authorId]
  );
}


// collega una citazione (già esistente, tramite citationId) a un articolo
// "executor" è di default il pool normale; se necessario si usa una connessione di transazione
async function linkCitationToArticle(articleId, citationId, executor = pool) {
  await executor.query(
    'INSERT INTO article_citations (article_id, citation_id) VALUES (?, ?)',
    [articleId, citationId]
  );
}



// =========================================================================================================
// SCRITTURA (create / update / delete)

// crea un nuovo articolo completo, con i suoi autori e citazioni collegati
// authorNames e citationTexts sono  array di stringhe 
async function createArticle(title, abstractText, publicationDate, doi, authorNames, citationTexts) {

  // prendo una connessione dedicata per gestire la transazione
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1) inserisco l'articolo principale
    const [articleResult] = await connection.query(
      'INSERT INTO articles (title, abstract, publication_date, doi) VALUES (?, ?, ?, ?)',
      [title.trim(), abstractText, publicationDate, doi]
    );
    const articleId = articleResult.insertId;

    // 2) per ogni autore: trovo/creo l'autore, poi lo collego
    // NOTA: si passa "connection" come executor, così linkAuthorToArticle usa la STESSA connessione di transazione, non il pool generico
    for (const name of authorNames) {
      const authorId = await findOrCreateAuthor(name);
      await linkAuthorToArticle(articleId, authorId, connection);
    }

    // 3) per ogni citazione: la creo (sempre nuova, nessun controllo duplicati), poi la collego
    for (const text of citationTexts) {
      const [citationResult] = await connection.query(
        'INSERT INTO citations (citation_text) VALUES (?)',
        [text.trim()]
      );
      const citationId = citationResult.insertId;

      await linkCitationToArticle(articleId, citationId, connection);
    }

    // se tutto funziona: confermo definitivamente la transazione
    await connection.commit();

    return articleId;

  } catch (error) {
    // se qualcosa è andato storto: annullo tutto quello fatto finora
    await connection.rollback();
    throw error;

  } finally {
    // rilascio sempre la connessione, in ogni caso
    connection.release();
  }
}


// aggiorna i campi di un articolo 
async function updateArticle(id, title, abstractText, publicationDate, doi, authorNames, citationTexts) {

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1) aggiorno i campi base dell'articolo
    const [result] = await connection.query(
      'UPDATE articles SET title = ?, abstract = ?, publication_date = ?, doi = ? WHERE id = ?',
      [title.trim(), abstractText, publicationDate, doi, id]
    );

    // se nessuna riga è stata modificata, l'articolo non esiste: interrompo qui, senza toccare le tabelle ponte
    if (result.affectedRows === 0) {
      await connection.rollback();
      return false;
    }

    // rimozione di TUTTI i collegamenti autori esistenti per questo articolo
    await connection.query(
      'DELETE FROM article_authors WHERE article_id = ?',
      [id]
    );

    // si ricreano i collegamenti da zero, con gli autori ricevuti (modificati)
    for (const name of authorNames) {
      const authorId = await findOrCreateAuthor(name);
      await linkAuthorToArticle(id, authorId, connection);
    }

    // si ripetono i due punti precedenti anch per le citazioni: rimuovo i vecchi collegamenti
    await connection.query(
      'DELETE FROM article_citations WHERE article_id = ?',
      [id]
    );

    // ricreazione delle citazioni da zero (sempre nuove righe)
    for (const text of citationTexts) {
      const [citationResult] = await connection.query(
        'INSERT INTO citations (citation_text) VALUES (?)',
        [text.trim()]
      );
      const citationId = citationResult.insertId;

      await linkCitationToArticle(id, citationId, connection);
    }

    await connection.commit();
    return true;

  } catch (error) {
    await connection.rollback();
    throw error;

  } finally {
    connection.release();
  }
}


// elimina un articolo dato il suo id
// grazie a ON DELETE CASCADE nello schema.sql, le righe collegate in article_authors e article_citations vengono rimosse automaticamente
async function deleteArticle(id) {
  const [result] = await pool.query(
    'DELETE FROM articles WHERE id = ?',
    [id]
  );

  return result.affectedRows > 0;
}


module.exports = {
  getAllArticles,
  getArticleById,
  findArticleByDoi,
  findArticleByTitle,
  findArticleByYear,
  findArticleByAuthor,
  getArticleAuthors,
  getArticleCitations,
  linkAuthorToArticle,
  linkCitationToArticle,
  createArticle,
  updateArticle,
  deleteArticle
};