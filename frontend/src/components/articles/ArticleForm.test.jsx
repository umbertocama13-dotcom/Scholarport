import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ArticleForm from './ArticleForm';

// "describe" raggruppa test correlati sotto un nome comune,
// utile per organizzare l'output quando lanci i test
describe('ArticleForm', () => {

  // TEST 1 — il form si renderizza vuoto senza initialData
  it('renderizza tutti i campi vuoti quando non riceve initialData', () => {
    // render() disegna il componente in un DOM virtuale (jsdom),
    // come farebbe un browser vero
    render(<ArticleForm onSubmit={() => {}} />);

    // screen.getByLabelText cerca un input associato a quella label
    // (funziona grazie a htmlFor="title" + id="title" già presenti nel tuo JSX)
    const titleInput = screen.getByLabelText('Titolo');

    // expect(...).toHaveValue('') verifica che il campo sia vuoto
    expect(titleInput).toHaveValue('');
  });

  // TEST 2 — il form si precompila con initialData
  it('precompila i campi quando riceve initialData', () => {
    const mockArticle = {
      title: 'Intro to SQL',
      abstract: 'Un abstract di test',
      publication_date: '2024-01-09T23:00:00.000Z',
      doi: '10.1000/sql1',
      authors: [{ id: 1, name: 'Alice Brown' }],
      citations: [{ id: 1, citation_text: 'Smith et al. 2020' }],
    };

    render(<ArticleForm initialData={mockArticle} onSubmit={() => {}} />);

    expect(screen.getByLabelText('Titolo')).toHaveValue('Intro to SQL');
    expect(screen.getByLabelText('DOI')).toHaveValue('10.1000/sql1');
  });

  // TEST 3 — digitare in un campo aggiorna il valore
  it('aggiorna il campo titolo quando l\'utente digita', async () => {
    // userEvent.setup() prepara un "utente finto" che simula interazioni
    // reali (più affidabile del semplice fireEvent)
    const user = userEvent.setup();

    render(<ArticleForm onSubmit={() => {}} />);

    const titleInput = screen.getByLabelText('Titolo');

    // user.type simula la digitazione carattere per carattere
    await user.type(titleInput, 'Nuovo Titolo');

    expect(titleInput).toHaveValue('Nuovo Titolo');
  });

  // TEST 4 — scrivere nell'ultimo riquadro autore ne genera uno nuovo vuoto
  it('aggiunge un nuovo riquadro autore quando si scrive nell\'ultimo disponibile', async () => {
    const user = userEvent.setup();

    render(<ArticleForm onSubmit={() => {}} />);

    // getAllByPlaceholderText restituisce un ARRAY di elementi che
    // condividono lo stesso placeholder (qui, inizialmente, solo 1)
    let authorInputs = screen.getAllByPlaceholderText('Inserisci un autore');
    expect(authorInputs).toHaveLength(1);

    // scrivo nel primo (e unico) riquadro
    await user.type(authorInputs[0], 'Marco Rossi');

    // dopo aver scritto, dovrebbe essercene comparso un secondo, vuoto
    authorInputs = screen.getAllByPlaceholderText('Inserisci un autore');
    expect(authorInputs).toHaveLength(2);
  });

  // TEST 5 — il submit chiama onSubmit con i dati puliti
  it('chiama onSubmit con i dati corretti, senza righe vuote negli array', async () => {
    const user = userEvent.setup();

    // vi.fn() crea una funzione "finta" di cui possiamo verificare
    // se/come è stata chiamata, senza doverla implementare per davvero
    const handleSubmit = vi.fn();

    render(<ArticleForm onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText('Titolo'), 'Test Articolo');
    await user.type(screen.getByLabelText('DOI'), '10.1000/test1');

    const authorInputs = screen.getAllByPlaceholderText('Inserisci un autore');
    await user.type(authorInputs[0], 'Alice Brown');

    // getByRole trova il bottone tramite il suo ruolo semantico e testo
    const submitButton = screen.getByRole('button', { name: 'Salva articolo' });
    await user.click(submitButton);

    // verifico che handleSubmit sia stata chiamata esattamente una volta
    expect(handleSubmit).toHaveBeenCalledTimes(1);

    // verifico che sia stata chiamata con un oggetto che CONTIENE
    // questi valori (objectContaining permette di non specificare
    // ogni singolo campo, solo quelli che ci interessa verificare)
    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Test Articolo',
        doi: '10.1000/test1',
        authors: ['Alice Brown'],
      })
    );
  });
});