// importo il pool di connessioni creato in db.js
// NOTA: la dicitura "../" salta indietro di una cartella (aggiungere tanti ../ quante cartelle si vuole tornare indietro)
// da qui poi siinserisce il nuovo percorso relativo (in questo caso db non è in sottocartelle)
const pool = require('../db');


// funzione asincrona che cerca un nome e lo restituisce; se non trovato lo crea
async function findOrCreateAuthor(name) {

  // normalizza il nome SOLO per fare il confronto (tolgo spazi + lowercase)
  const normalizedName = name.trim().toLowerCase();

  // cerca nel database se esiste già un autore con questo nome; normalizza anche il dato lato db
  const [rows] = await pool.query(
    'SELECT id FROM authors WHERE LOWER(TRIM(name)) = ?',
    [normalizedName]
  );

  // si sfrutta la proprietà degli array, se non è vuoto --> il risultato è stato trovato e si restituisce
  if (rows.length > 0) {
    return rows[0].id;
  }

  // inserimento del nuovo record
  const [result] = await pool.query(
    'INSERT INTO authors (name) VALUES (?)',
    [name.trim()]
  );

  // "result.insertId" contiene l'id generato automaticamente da AUTO_INCREMENT per la riga appena inserita
  return result.insertId;
}


// Recupera tutti gli autori
async function getAllAuthors() {
  const [rows] = await pool.query('SELECT id, name FROM authors ORDER BY name ASC');
  return rows;
}


// recupera solo autore con id specifico
async function getAuthorById(id) {
  const [rows] = await pool.query(
    'SELECT id, name FROM authors WHERE id = ?',
    [id]
  );

  return rows.length > 0 ? rows[0] : null;
}


// aggiorna il nome di un autore esistente, dato il suo id
async function updateAuthor(id, name) {
  const normalizedName = name.trim().toLowerCase();

  // ricerca del nome e controllo
  const [existingRows] = await pool.query(
    'SELECT id FROM authors WHERE LOWER(TRIM(name)) = ?',
    [normalizedName]
  );

  // controlla se il nome non esiste già con un altro ID
  if (existingRows.length > 0 && existingRows[0].id !== Number(id)) {
    return false;
  }

  // aggiornamento
  const [result] = await pool.query(
    'UPDATE authors SET name = ? WHERE id = ?',
    [name.trim(), id]
  );

  // "result.affectedRows" dice quante righe sono state modificate dalla query
  // se è 0, vuol dire che nessun autore aveva quell'id (quindi nulla è stato aggiornato)
  // restituisco un booleano: true se l'update ha davvero modificato qualcosa, false altrimenti
  return result.affectedRows > 0;
}


// elimina un autore dato il suo id
async function deleteAuthor(id) {
  const [result] = await pool.query(
    'DELETE FROM authors WHERE id = ?',
    [id]
  );

  return result.affectedRows > 0;
}


// esportazione di tutte le funzioni del model, così sono disponibili per chi importa questo file
module.exports = {
  findOrCreateAuthor,
  getAllAuthors,
  getAuthorById,
  updateAuthor,
  deleteAuthor
};