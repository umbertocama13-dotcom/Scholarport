import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ArticlePage from './pages/ArticlePage';
import ArticleFormPage from './pages/ArticleFormPage';
import NotFoundPage from './pages/NotFoundPage';

// funzione di supporto: renderizza le stesse route di App.jsx,
// ma partendo da un URL specifico scelto per il test, invece che
// dall'URL vero del browser (che nei test non esiste)
function renderWithRoute(initialRoute) {
  render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/articles/new" element={<ArticleFormPage />} />
        <Route path="/articles/:id" element={<ArticlePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('Routing dell\'app', () => {

  // TEST 1 — la home mostra il titolo ScholarPort
  it('visitando "/" viene mostrata la HomePage', () => {
    renderWithRoute('/');

    expect(screen.getByText('ScholarPort')).toBeInTheDocument();
  });

  // TEST 2 — /articles/new mostra il form di creazione
  it('visitando "/articles/new" viene mostrata la pagina di creazione', () => {
    renderWithRoute('/articles/new');

    expect(screen.getByText('Nuovo articolo')).toBeInTheDocument();
  });

  // TEST 3 — /articles/:id mostra ArticlePage (verifichiamo lo spinner
  // iniziale, dato che la fetch reale non va a buon fine nel test)
  it('visitando "/articles/5" viene mostrata la pagina di dettaglio', () => {
    renderWithRoute('/articles/5');

    // ArticlePage, appena montata, mostra sempre lo Spinner mentre
    // aspetta la risposta del backend (che nel test non arriva mai)
    expect(screen.getByText('Caricamento in corso...')).toBeInTheDocument();
  });

  // TEST 4 — "/articles/new" NON deve mai essere interpretato come
  // se "new" fosse un id (verifica dell'insidia dell'ordine delle route)
  it('"/articles/new" non viene interpretato come /articles/:id', () => {
    renderWithRoute('/articles/new');

    // se fosse finito su ArticlePage per errore, vedremmo lo Spinner
    // invece del titolo "Nuovo articolo"
    expect(screen.queryByText('Caricamento in corso...')).not.toBeInTheDocument();
    expect(screen.getByText('Nuovo articolo')).toBeInTheDocument();
  });

  // TEST 5 — un URL non esistente mostra la pagina 404
  it('un URL non corrispondente a nessuna route mostra la pagina 404', () => {
    renderWithRoute('/percorso/che/non/esiste');

    // NOTA: il testo esatto dipende da cosa hai scritto in NotFoundPage.jsx
    // se il test fallisce, aggiusteremo la stringa cercata
    expect(screen.getByText(/non trovat/i)).toBeInTheDocument();
  });
});