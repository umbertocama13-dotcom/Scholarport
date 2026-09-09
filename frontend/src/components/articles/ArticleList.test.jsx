import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ArticleList from './ArticleList';

const mockArticles = [
  {
    id: 1,
    title: 'Intro to SQL',
    abstract: 'A beginner article about SQL databases.',
    publication_date: '2024-01-09T23:00:00.000Z',
    doi: '10.1000/sql1',
  },
  {
    id: 2,
    title: 'Data Modeling Basics',
    abstract: 'An article about relational design.',
    publication_date: '2024-02-14T23:00:00.000Z',
    doi: '10.1000/sql2',
  },
];

describe('ArticleList', () => {

  // TEST 1 — renderizza tante ArticleCard quanti sono gli articoli
  it('renderizza una card per ogni articolo ricevuto', () => {
    render(<ArticleList articles={mockArticles} onView={() => {}} onEdit={() => {}} />);

    expect(screen.getByText('Intro to SQL')).toBeInTheDocument();
    expect(screen.getByText('Data Modeling Basics')).toBeInTheDocument();
  });

  // TEST 2 — con un array vuoto, mostra il messaggio di lista vuota
  it('mostra un messaggio quando l\'array di articoli è vuoto', () => {
    render(<ArticleList articles={[]} onView={() => {}} onEdit={() => {}} />);

    expect(screen.getByText('Nessun articolo trovato.')).toBeInTheDocument();
  });

  // TEST 3 — con articles undefined/null, non va in crash
  it('non va in crash e mostra il messaggio di vuoto se articles è undefined', () => {
    render(<ArticleList articles={undefined} onView={() => {}} onEdit={() => {}} />);

    expect(screen.getByText('Nessun articolo trovato.')).toBeInTheDocument();
  });

  // TEST 4 — ogni card mostra correttamente i dati dell'articolo (DOI incluso)
  it('mostra correttamente titolo, DOI e abstract di ciascun articolo', () => {
    render(<ArticleList articles={mockArticles} onView={() => {}} onEdit={() => {}} />);

    expect(screen.getByText(/10\.1000\/sql1/)).toBeInTheDocument();
    expect(screen.getByText('A beginner article about SQL databases.')).toBeInTheDocument();
  });

  // TEST 5 — cliccando "Vedi dettagli" su una card, viene chiamata onView con l'id corretto
  it('chiama onView con l\'id corretto quando si clicca Vedi dettagli', async () => {
  const user = userEvent.setup();
  const handleView = vi.fn();

  render(<ArticleList articles={mockArticles} onView={handleView} onEdit={() => {}} />);

  const viewButtons = screen.getAllByRole('button', { name: 'Vedi dettagli' });
  await user.click(viewButtons[0]);

  expect(handleView).toHaveBeenCalledWith(1);
  });
});