import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ArticleFilters from './ArticleFilters';

describe('ArticleFilters', () => {

  // TEST 1 — il form si renderizza con tutti i campi vuoti
  it('renderizza tutti i campi filtro vuoti', () => {
    render(<ArticleFilters onFilter={() => {}} />);

    expect(screen.getByLabelText('Titolo')).toHaveValue('');
    expect(screen.getByLabelText('Autore')).toHaveValue('');
    expect(screen.getByLabelText('Anno')).toHaveValue(null); // input type="number" vuoto restituisce null, non ''
    expect(screen.getByLabelText('DOI')).toHaveValue('');
  });

  // TEST 2 — digitare nel campo titolo aggiorna il valore
  it('aggiorna il campo titolo quando l\'utente digita', async () => {
    const user = userEvent.setup();
    render(<ArticleFilters onFilter={() => {}} />);

    const titleInput = screen.getByLabelText('Titolo');
    await user.type(titleInput, 'sql');

    expect(titleInput).toHaveValue('sql');
  });

  // TEST 3 — al submit, onFilter viene chiamata con i valori compilati
  it('chiama onFilter con i valori inseriti al submit', async () => {
    const user = userEvent.setup();
    const handleFilter = vi.fn();

    render(<ArticleFilters onFilter={handleFilter} />);

    await user.type(screen.getByLabelText('Titolo'), 'sql');
    await user.click(screen.getByRole('button', { name: 'Filtra' }));

    expect(handleFilter).toHaveBeenCalledWith({
      title: 'sql',
      doi: '',
      year: '',
      author: '',
    });
  });

  // TEST 4 — cliccando "Reset", tutti i campi tornano vuoti
  it('svuota tutti i campi quando si clicca Reset', async () => {
    const user = userEvent.setup();
    render(<ArticleFilters onFilter={() => {}} />);

    const titleInput = screen.getByLabelText('Titolo');
    await user.type(titleInput, 'sql');
    expect(titleInput).toHaveValue('sql');

    await user.click(screen.getByRole('button', { name: 'Reset' }));

    expect(titleInput).toHaveValue('');
  });

  // TEST 5 — cliccando "Reset", onFilter viene chiamata con valori vuoti
  it('chiama onFilter con valori vuoti quando si clicca Reset', async () => {
    const user = userEvent.setup();
    const handleFilter = vi.fn();

    render(<ArticleFilters onFilter={handleFilter} />);

    await user.type(screen.getByLabelText('Titolo'), 'sql');
    await user.click(screen.getByRole('button', { name: 'Reset' }));

    expect(handleFilter).toHaveBeenCalledWith({
      title: '',
      doi: '',
      year: '',
      author: '',
    });
  });
});