const mysql = require('mysql2/promise');

// Configurazione della connessione al database

// pool crea la possibilità di multiconnessione al database

// connectionLimit e queueLimit sono il numero massimo di utenti connessi e di utenti in coda per la connessione

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 5
});

module.exports = pool;

