// importo il pool di connessioni creato in db.js
const pool = require('../db');


// crea una nuova citazione
// non si controllano i duplicati per una questione di scelta (la citazione è volutamente testo libero, non strutturata)
async function createCitation(citationText) {
  const [result] = await pool.query(
    'INSERT INTO citations (citation_text) VALUES (?)',
    [citationText.trim()]
  );

  // si restituisce l'id generato automaticamente da AUTO_INCREMENT del DB
  return result.insertId;
}


// recupera tutte le citazioni
async function getAllCitations() {
  const [rows] = await pool.query('SELECT id, citation_text FROM citations ORDER BY id ASC');
  return rows;
}


// recupera una singola citazione dato il suo id
async function getCitationById(id) {
  const [rows] = await pool.query(
    'SELECT id, citation_text FROM citations WHERE id = ?',
    [id]
  );

  return rows.length > 0 ? rows[0] : null;
}


// aggiorna il testo di una citazione esistente, dato il suo id
// non si controllano i duplicati per una questione di scelta (la citazione è volutamente testo libero, non strutturata)
async function updateCitation(id, citationText) {
  const [result] = await pool.query(
    'UPDATE citations SET citation_text = ? WHERE id = ?',
    [citationText.trim(), id]
  );

  return result.affectedRows > 0;
}


// elimina una citazione dato il suo id
async function deleteCitation(id) {
  const [result] = await pool.query(
    'DELETE FROM citations WHERE id = ?',
    [id]
  );

  return result.affectedRows > 0;
}


// esportazione di tutte le funzioni del model
module.exports = {
  createCitation,
  getAllCitations,
  getCitationById,
  updateCitation,
  deleteCitation
};