
ScholarPort è una piattaforma pensata per i ricercatori accademici che vogliono gestire in modo semplice e centralizzato il proprio portfolio di pubblicazioni. Permette di inserire articoli con titolo, autori, abstract, data di pubblicazione e DOI, di collegare le citazioni associate a ogni articolo, e di cercare e filtrare le pubblicazioni per titolo, autore, anno di pubblicazione o DOI, tramite un'interfaccia web moderna e responsive.

- Documentazione tecnica
Per una spiegazione approfondita di come sono strutturati backend e frontend, delle scelte implementative e del perché di certe decisioni, vedi:

docs/backend-architecture.md
docs/frontend-architecture.md


*Come avviare il progetto*
Segui questi passaggi in ordine per installare e avviare l'applicazione sul tuo computer.

1. Prerequisiti
Node.js installato sul computer (installabile da https://nodejs.org/en)
MySQL Server installato e in esecuzione (consigliato MySQL Workbench per gestire il database tramite interfaccia grafica, link per il download  https://dev.mysql.com/downloads/workbench/)


2. Scaricare/clonare il progetto
Estrai lo zip (o clona il repository) in una cartella a tua scelta, e apri quella cartella nel terminale.


3. Creare il database
Apri MySQL Workbench (o il tuo client MySQL preferito) e assicurati che il server MySQL sia in esecuzione.

Esegui i due file SQL presenti nella cartella database/, nell'ordine seguente:

`database/schema.sql` → crea il database scholarport e tutte le tabelle (articoli, autori, citazioni e le relative tabelle di collegamento)
`database/seed.sql` → inserisce alcuni dati di esempio (facoltativo, ma consigliato per testare subito l'app)
In MySQL Workbench: File → Open SQL Script..., seleziona il file, poi esegui l'intero script con il tasto ⚡ (o Ctrl + Shift + Enter).

Nota: se in futuro modifichi schema.sql, ricorda che il file da solo non aggiorna un database già creato — va rieseguito (o vanno applicate manualmente le modifiche) perché i cambiamenti abbiano effetto.


4. Configurare le variabili d'ambiente del backend
Spostati nella cartella del backend:

`cd 02-backend`

Apri il file .env e inserisci le tue credenziali MySQL:

`PORT=3000`
`DB_HOST=localhost`
`DB_USER=root`
`DB_PASSWORD=la_tua_password`
`DB_NAME=scholarport`
`DB_PORT=3306`



5. Installare le dipendenze del backend
Sempre dentro la cartella backend/:

`npm install`


6. Avviare il backend
Dalla stessa cartella backend/:

`npm run dev`

Se tutto è configurato correttamente, nel terminale comparirà:

`"Server running on port 3000"`

Lascia questo terminale aperto: il backend deve restare in esecuzione mentre usi l'app.


7. Installare le dipendenze del frontend
Apri un nuovo terminale (senza chiudere quello del backend), spostati nella cartella del frontend:

`cd frontend`
Installa i pacchetti necessari:

`npm install`


8. Avviare il frontend
Sempre dentro la cartella frontend/:

`npm run dev`

Il terminale mostrerà l'indirizzo locale su cui è raggiungibile l'app, tipicamente:

`➜  Local:   http://localhost:5173/`

Apri quell'indirizzo nel browser. A questo punto sia il backend che il frontend sono attivi e il progetto è pronto all'uso.


9. Eseguire i test automatici (facoltativo)
Per lanciare la suite di test del frontend, dalla cartella frontend/:

`npm run test`

I test girano in modalità "watch" (si rieseguono automaticamente ad ogni modifica dei file). Per una singola esecuzione:

`npm run test -- --run`



- Tecnologie utilizzate
Frontend: React, Vite, React Router, Vitest + React Testing Library
Backend: Node.js, Express, mysql2
Database: MySQL
Funzionalità principali
Gestione completa (crea, leggi, aggiorna, elimina) di articoli accademici
Ogni articolo può avere più autori e più citazioni collegate
Ricerca per titolo (parziale), DOI (esatto), anno di pubblicazione o autore (parziale)
Riconoscimento automatico degli autori già esistenti, per evitare duplicati nel database
Interfaccia responsive, utilizzabile sia da desktop che da dispositivi mobili

