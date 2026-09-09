// importazione di express
const express = require('express');
const cors = require('cors'); 

// creazione di una nuova istanza di express
const app = express();

// middleware: va messo PRIMA delle route, così si applica a ogni richiesta in arrivo
app.use(cors());

// middleware: interpreta automaticamente il body JSON delle richieste e lo rende disponibile in req.body
app.use(express.json());


// importazione dei router per ogni entità
// l'espressione "./" indica che dalla stessa cartella segue un nuovo percorso --> es: 02-routes/articleRoutes
const articleRoutes = require('./02-routes/articleRoutes');
const authorRoutes = require('./02-routes/authorRoutes');
const citationRoutes = require('./02-routes/citationRoutes');

// collegamento dei router: ogni richiesta che inizia con questi prefissi viene smistata al router corrispondente
app.use('/api/articles', articleRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/citations', citationRoutes);


// route di test: verifica che il server risponda
app.get('/', (req, res) => {
  res.send('Backend online');
});

// esporta l'istanza configurata di app, così server.js può importarla e avviarla
module.exports = app;