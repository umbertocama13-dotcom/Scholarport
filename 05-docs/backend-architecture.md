# ScholarPort — Architettura del Backend

Documento di riferimento per capire, a colpo d'occhio, come è strutturato il backend e perché. Utile come promemoria futuro e come traccia dello studio fatto durante lo sviluppo.

---

## 1. Configurazione di base

### `.env`
File con le variabili d'ambiente: credenziali del database, porta del server.
- **Non va mai caricato su Git** (contiene dati sensibili come la password del DB), da inserire in .gitignore.
- Va accompagnato da un `.env.example` (senza valori reali) per permettere ad altri di ricreare la configurazione.
- Viene letto tramite il pacchetto `dotenv`, richiamato con `require('dotenv').config()` all'inizio di `server.js`.

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=********
DB_NAME=scholarport
DB_PORT=3306
```

### `package.json`
Manifesto del progetto Node: nome, dipendenze, script di avvio.
- `dependencies` → pacchetti necessari per **far girare** l'app (`express`, `mysql2`, `dotenv`).
- `devDependencies` → pacchetti utili solo **in sviluppo** (`nodemon`, per il riavvio automatico).
- `scripts.start` → avvio normale (`node src/server.js`).
- `scripts.dev` → avvio con auto-reload ad ogni modifica (`nodemon src/server.js`).

---

## 2. L'impalcatura (infrastruttura di supporto)

Questi tre file non contengono "logica di business" — permettono all'API di esistere e di essere raggiungibile.

| File | Ruolo | Cosa fa concretamente |
|---|---|---|
| **`db.js`** | Canale verso il database | Crea un **pool di connessioni** MySQL (`mysql2/promise`), riutilizzabili da tutte le query, senza doverle aprire/chiudere una per una |
| **`app.js`** | Contenitore dell'applicazione | Crea l'istanza Express (`express()`), registra i middleware globali (es. `express.json()`) e collega le route |
| **`server.js`** | Attivatore del servizio | Carica `.env`, importa `app.js`, e lo mette realmente in ascolto su una porta con `app.listen(PORT)` |

**Flusso di avvio:**
```
server.js
  → carica .env (dotenv)
  → importa app.js (che nel frattempo si è già configurato: middleware + route)
  → app.listen(PORT) → il server è ora raggiungibile da HTTP
```

**Perché il pool e non una connessione singola:**
il pool apre le connessioni **gradualmente**, solo quando servono (fino a un massimo configurato, es. 10), e le riutilizza tra una richiesta e l'altra invece di aprirle/chiuderle ogni volta — permette a più richieste di essere gestite in parallelo in modo efficiente.

---

## 3. I tre livelli logici dell'API

Ogni entità del dominio (Article, Author, Citation) è divisa su tre livelli, ognuno con una responsabilità precisa e **senza sovrapposizioni**.

```
routes/        →  SMISTANO: input di URL + metodo HTTP → quale funzione del controller
controllers/   →  ORCHESTRANO: leggono req, validano, chiamano il model, rispondono con res
models/        →  ESEGUONO: parlano col database (query SQL), non sanno nulla di HTTP
```

### `models/`
- Contiene **una funzione per ogni operazione sui dati** (query SQL parametrizzata con `?` per sicurezza, mai concatenazione diretta di stringhe → previene SQL Injection).
- Non conosce `req`/`res`, non sa che esiste Express — potrebbe essere riusato anche fuori da un contesto web.
- `articleModel.js` usa le **transazioni** (`beginTransaction` / `commit` / `rollback`) per `createArticle`, perché l'operazione coinvolge più tabelle collegate (articolo + autori + citazioni): o va tutto a buon fine, o si annulla tutto, evitando dati incoerenti.

### `controllers/`
- Una funzione per ogni **azione esposta dall'API** (spesso raggruppa/aggrega più funzioni del model, es. `getArticleById` nel controller richiama sia `getArticleById` che `getArticleAuthors`/`getArticleCitations` del model).
- Legge `req.body` (dati inviati nel corpo della richiesta), `req.params` (valori nell'URL, es. `:id`), `req.query` (parametri dopo `?`, usati per ricerche/filtri).
- Gestisce gli errori con `try/catch` e risponde sempre con uno **status code HTTP** coerente:
  - `200` → richiesta andata a buon fine (lettura/modifica)
  - `201` → risorsa creata con successo
  - `400` → richiesta malformata (dati obbligatori mancanti)
  - `404` → risorsa non trovata
  - `409` → conflitto (es. nome già esistente)
  - `500` → errore interno/del database

### `routes/`
- File brevi, "dichiarativi": nessuna logica, solo l'associazione `metodo + URL → funzione del controller`.
- Esempio concettuale: `router.get('/:id', articleController.getArticleById)`.
- L'**ordine delle route conta**: percorsi più specifici (es. `/search`) vanno dichiarati **prima** di percorsi con parametro generico (es. `/:id`), altrimenti Express interpreterebbe `"search"` come se fosse un id.

---

## 4. Flusso completo di una richiesta (esempio: `GET /api/articles/5`)

```
1. Il client (React) invia:  GET http://localhost:3000/api/articles/5

2. server.js è in ascolto sulla porta → riceve la richiesta

3. app.js smista la richiesta a articleRoutes.js

4. articleRoutes.js riconosce il pattern /:id
   → chiama articleController.getArticleById(req, res)

5. Il controller:
   - legge req.params.id → "5"
   - chiama await articleModel.getArticleById("5")

6. Il model:
   - esegue SELECT * FROM articles WHERE id = ? tramite il pool
   - restituisce la riga trovata (o null)

7. Il controller:
   - se null → res.status(404).json({...})
   - se trovato → recupera anche autori/citazioni collegati (Promise.all)
     e risponde con res.status(200).json({...})

8. La risposta HTTP torna al client
```

---

## 5. Perché le tabelle ponte e le funzioni "find or create"

- `article_authors` e `article_citations` sono **tabelle ponte** per relazioni many-to-many (un articolo ha più autori, un autore ha più articoli).
- `authorModel.findOrCreateAuthor(name)`: prima cerca un autore con lo stesso nome (confronto normalizzato con `TRIM` + `LOWER`, per evitare duplicati causati da spazi o maiuscole diverse), e solo se non lo trova ne crea uno nuovo. Se lo trova, **riusa** l'id esistente.
- `citationModel.createCitation(text)`: nessun controllo duplicati — una citazione può ripresentarsi con testo simile/identico in articoli diversi (o anche nello stesso), è considerato un caso legittimo, non un errore.

---

## 6. Convenzioni adottate nel progetto

- **Query sempre parametrizzate** (`?` + array di valori) → mai concatenazione diretta di input utente in una stringa SQL.
- **`AUTO_INCREMENT`** per gli id → non vengono mai passati manualmente in una `INSERT`.
- **`doi UNIQUE`** → previene articoli duplicati, ma permette più valori `NULL` (articoli senza DOI assegnato).
- **Percorsi relativi** (`require('../../db')`) per importare file propri del progetto → mai percorsi assoluti legati a una macchina specifica.
- **Naming**: `<entità>Model.js`, `<entità>Controller.js`, `<entità>Routes.js` → un file per entità, mai un file per singola funzione.
