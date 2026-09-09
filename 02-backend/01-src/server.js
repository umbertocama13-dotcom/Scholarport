
// carica le variabili da .env dentro process.env, rendendole disponibili nel resto del programma
require('dotenv').config({ quiet: true });

// recupera la configurazione di app.js
const app = require('./app');

// definisce il numero di porta da usare (letto da .env, con fallback a 3000 se non specificato)
const PORT = process.env.PORT || 3000;

// avvia il server sulla porta scelta; il callback stampa un messaggio di conferma in console
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
