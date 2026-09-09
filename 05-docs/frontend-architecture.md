# ScholarPort — Architettura del Frontend

Documento di riferimento per capire come è strutturato il frontend e perché. Da utilizzare come promemoria futuro per sviluppo di qualcosa di simile.

---

## 1. Configurazione di base

### `index.html`
L'**unico** file HTML reale di tutta l'applicazione (ScholarPort è una Single Page Application). Contiene solo un contenitore vuoto:
```html
<div id="root"></div>
<script type="module" src="/src/main.jsx"></script>
```
Tutto il resto dell'interfaccia viene generato dinamicamente da React e iniettato in quel div.

### `main.jsx`
Punto di ingresso dell'app: cerca `<div id="root">` e vi monta dentro il componente `App`. Eseguito una sola volta, all'avvio.
```javascript
createRoot(document.getElementById('root')).render(<App />);
```

### `package.json`
- `dependencies`: `react`, `react-dom`, `react-router-dom`.
- `devDependencies`: `vite`, `eslint`, `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `jsdom`.
- `scripts.dev`: avvia il server di sviluppo Vite (`vite`).
- `scripts.test`: avvia i test automatici (`vitest`).

### `vitest.config.js`
Configura l'ambiente di test: `environment: 'jsdom'` (simula un browser dentro Node), `globals: true` (rende `describe`/`it`/`expect` disponibili senza import espliciti), `setupFiles` punta a `src/test/setup.js` (carica le asserzioni aggiuntive di `jest-dom`).

---

## 2. I livelli logici del frontend

```
services/    →  PARLANO col backend: funzioni fetch(), non sanno come i dati vengono mostrati
components/  →  MOSTRANO: ricevono dati tramite props, "ciechi" rispetto a backend e routing
pages/       →  ORCHESTRANO: chiamano i services, tengono lo stato, passano i dati ai components
App.jsx      →  SMISTA: decide quale pagina mostrare in base all'URL (routing)
```

Regola di dipendenza a senso unico (come nel backend):
```
App → pages → components → (props semplici, nessuna dipendenza da services)
pages → services → backend
```

### `services/`
Un file per entità (`articleService.js`, `authorService.js`, `citationService.js`), costruiti **rispecchiando esattamente** le route del backend — ogni funzione di route ha una funzione service gemella. Usano `fetch()`, restituiscono sempre `response.json()`, e lanciano un errore esplicito se `response.ok` è `false` (a differenza delle query SQL, `fetch` non genera errore da solo per status 404/500).

### `components/`
Organizzati per dominio (`articles/`, `common/`). Ogni componente riceve dati e funzioni tramite **props**, non chiama mai direttamente un service. Esempio di gerarchia:
```
ArticleList (assembla)
  --> ArticleCard (mostra un singolo articolo, riceve onView/onEdit come props)
```
`ArticleForm.jsx` è condiviso tra creazione e modifica: se riceve `initialData`, si precompila; altrimenti parte vuoto. La differenza la decide chi lo usa (la pagina), non il componente stesso.

### `pages/`
Una per schermata: `HomePage` (lista + filtri), `ArticlePage` (dettaglio, con modalità modifica/eliminazione tramite `ArticleDetails`), `ArticleFormPage` (creazione), `NotFoundPage` (route non riconosciute).
Gestiscono tre stati tipici per ogni fetch: `loading`, `error`, dati pronti — pattern:
```javascript
{loading ? <Spinner /> : error ? <p>{error}</p> : <Contenuto />}
```

### `App.jsx`
Configura `react-router-dom`: avvolge l'app in `BrowserRouter`, definisce le corrispondenze URL → pagina con `Routes`/`Route`. Le route più specifiche (`/articles/new`) vanno dichiarate **prima** di quelle generiche con parametro (`/articles/:id`), stessa insidia già vista nel backend con `/search` vs `/:id`.


---

## 3. Decisioni prese e perché

- **Un unico componente `ArticleForm` per creazione e modifica**, invece di due form separati — evita duplicazione di codice, la differenza è solo nella presenza configurazione in cui nella modifica è possibile modificare.
- **Autori e citazioni come "riquadri dinamici"** (array di stringhe, con un riquadro vuoto sempre in coda pronto per un nuovo inserimento) invece di un singolo campo di testo con virgole — più chiaro per l'utente, coerente con la struttura ad array che il backend si aspetta.
- **Ricerca con un solo filtro alla volta** (titolo, DOI, anno o autore) — coerente con la logica `if/else` sequenziale del controller backend; non è previsto un filtro combinato con più criteri contemporaneamente.
- **CORS abilitato nel backend** (`app.use(cors())`) — necessario perché frontend (`localhost:5173`) e backend (`localhost:3000`) girano su porte diverse, e il browser blocca di default le richieste cross-origin.
- **`box-sizing: border-box` globale nel CSS** — senza questa regola alcuni riquadri sbordano e si intersecano.

---

## 4. Test automatici

Framework: **Vitest** + **React Testing Library** (`@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`).

Convenzione: ogni file di test sta **accanto** al file che testa (`ArticleForm.jsx` + `ArticleForm.test.jsx` nella stessa cartella), non in una cartella `test/` centralizzata — eccetto `src/test/setup.js`, che è configurazione globale, non un test.

Componenti/aree coperte (5 test ciascuno, 25 totali):
- `ArticleForm` — form di inserimento/modifica
- `ArticleFilters` — ricerca e filtro
- `ArticleDetails` — dettaglio articolo, incluso pannello citazioni
- `ArticleList` (+ `ArticleCard` indirettamente) — visualizzazione lista
- Routing (`App.jsx`) — navigazione tra pagine, incluso il caso limite `/articles/new` vs `/articles/:id`

Comando per lanciare i test: `npm run test` (dalla cartella `frontend/`), oppure `npm run test -- --run` per una singola esecuzione senza "ascolto" automatico.

