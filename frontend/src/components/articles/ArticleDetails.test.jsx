import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ArticleDetails from './ArticleDetails';

// dato di esempio riusato in più test, per non ripeterlo ogni volta
const mockArticle = {
  id: 1,
  title: 'Intro to SQL',
  abstract: 'Un abstract di prova',
  publication_date: '2024-01-09T23:00:00.000Z',
  doi: '10.1000/sql1',
  authors: [
    { id: 1, name: 'Alice Brown' },
    { id: 2, name: 'Marco Rossi' },
  ],
  citations: [
    { id: 1, citation_text: 'Smith et al. 2020' },
  ],
};

describe('ArticleDetails', () => {

  // TEST 1 — mostra correttamente i dati base dell'articolo
  it('mostra titolo, DOI e abstract dell\'articolo', () => {
    render(<ArticleDetails article={mockArticle} onUpdate={() => {}} onDelete={() => {}} />);

    expect(screen.getByText('Intro to SQL')).toBeInTheDocument();
    expect(screen.getByText(/10\.1000\/sql1/)).toBeInTheDocument();
    expect(screen.getByText('Un abstract di prova')).toBeInTheDocument();
  });

  // TEST 2 — mostra correttamente autori e citazioni collegati
  // (requisito esplicito della consegna: "pannello per la
  // visualizzazione delle citazioni associate a un articolo")
  it('mostra la lista di autori e citazioni collegati', () => {
    render(<ArticleDetails article={mockArticle} onUpdate={() => {}} onDelete={() => {}} />);

    expect(screen.getByText('Alice Brown')).toBeInTheDocument();
    expect(screen.getByText('Marco Rossi')).toBeInTheDocument();
    expect(screen.getByText('Smith et al. 2020')).toBeInTheDocument();
  });

  // TEST 3 — con autori/citazioni vuoti, mostra i messaggi di fallback
  it('mostra i messaggi di fallback quando non ci sono autori o citazioni', () => {
    const articleSenzaRelazioni = {
      ...mockArticle,
      authors: [],
      citations: [],
    };

    render(<ArticleDetails article={articleSenzaRelazioni} onUpdate={() => {}} onDelete={() => {}} />);

    expect(screen.getByText('Nessun autore collegato.')).toBeInTheDocument();
    expect(screen.getByText('Nessuna citazione collegata.')).toBeInTheDocument();
  });

  // TEST 4 — cliccando "Modifica", passa in modalità edit e mostra il form
  it('passa in modalità modifica mostrando il form quando si clicca Modifica', async () => {
    const user = userEvent.setup();

    render(<ArticleDetails article={mockArticle} onUpdate={() => {}} onDelete={() => {}} />);

    await user.click(screen.getByRole('button', { name: 'Modifica' }));

    // in modalità modifica, dovrebbe comparire il titolo del form
    // e il campo Titolo dovrebbe essere precompilato
    expect(screen.getByText('Modifica articolo')).toBeInTheDocument();
    expect(screen.getByLabelText('Titolo')).toHaveValue('Intro to SQL');
  });

  // TEST 5 — cliccando "Elimina" e confermando, viene chiamata onDelete
  it('chiama onDelete con l\'id corretto quando si conferma l\'eliminazione', async () => {
    const user = userEvent.setup();
    const handleDelete = vi.fn();

    // window.confirm normalmente apre un vero popup del browser,
    // che nei test non esiste: lo "sostituiamo" con una versione finta
    // che restituisce sempre true (come se l'utente avesse cliccato OK)
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    render(<ArticleDetails article={mockArticle} onUpdate={() => {}} onDelete={handleDelete} />);

    await user.click(screen.getByRole('button', { name: 'Elimina' }));

    expect(handleDelete).toHaveBeenCalledWith(1);
  });
});