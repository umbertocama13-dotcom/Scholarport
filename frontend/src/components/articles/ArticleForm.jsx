import { useEffect, useState } from 'react';

const ArticleForm = ({ initialData, onSubmit }) => {

  // si definiscono le variabili di stato per i campi semplici del form,
  // ognuna parte vuota finché non viene eventualmente popolata
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [publicationDate, setPublicationDate] = useState('');
  const [doi, setDoi] = useState('');

  // si tengono autori e citazioni come array separati, non dentro un
  // unico oggetto, perché la loro logica di aggiornamento è diversa
  // (array che cresce/si riduce dinamicamente, non un singolo valore)
  // si parte sempre con un riquadro vuoto pronto per il primo inserimento
  const [authors, setAuthors] = useState(['']);
  const [citations, setCitations] = useState(['']);


  // si esegue questo blocco solo quando "initialData" (in fondo) cambia
  // (in pratica: solo quando il form viene aperto in modalità modifica,
  // con i dati di un articolo esistente da precompilare)
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setAbstract(initialData.abstract || '');

      // si taglia la parte oraria della data, perché l'input di tipo
      // "date" accetta solo il formato YYYY-MM-DD, non l'ISO completo
      setPublicationDate(
        initialData.publication_date ? initialData.publication_date.split('T')[0] : ''
      );
      setDoi(initialData.doi || '');

      // si estraggono solo i nomi/testi dagli oggetti ricevuti dal backend,
      // così l'array resta sempre fatto di sole stringhe, coerente con
      // quello che le funzioni sotto si aspettano di gestire
      setAuthors(
        initialData.authors && initialData.authors.length > 0
          ? [...initialData.authors.map((a) => a.name), '']
          : ['']
      );

      setCitations(
        initialData.citations && initialData.citations.length > 0
          ? [...initialData.citations.map((c) => c.citation_text), '']
          : ['']
      );
    }
  }, [initialData]);


  // si aggiorna il riquadro autore modificato; se si è appena scritto
  // nell'ULTIMO riquadro disponibile, se ne aggiunge automaticamente
  // uno nuovo vuoto in coda, pronto per un ulteriore inserimento
  const handleAuthorChange = (index, value) => {
    const updatedAuthors = [...authors];
    updatedAuthors[index] = value;

    if (index === authors.length - 1 && value.trim() !== '') {
      updatedAuthors.push('');
    }

    setAuthors(updatedAuthors);
  };

  // si applica la stessa identica logica alle citazioni
  const handleCitationChange = (index, value) => {
    const updatedCitations = [...citations];
    updatedCitations[index] = value;

    if (index === citations.length - 1 && value.trim() !== '') {
      updatedCitations.push('');
    }

    setCitations(updatedCitations);
  };


  // si rimuove un riquadro autore specifico; si evita di rimuovere
  // l'ultimo riquadro rimasto, per non lasciare il form senza input
  const removeAuthor = (indexToRemove) => {
    if (authors.length === 1) return;

    setAuthors((prevAuthors) =>
      prevAuthors.filter((_, index) => index !== indexToRemove)
    );
  };

  
  const removeCitation = (indexToRemove) => {
    if (citations.length === 1) return;

    setCitations((prevCitations) =>
      prevCitations.filter((_, index) => index !== indexToRemove)
    );
  };


  // si intercetta l'invio del form
  const handleSubmit = (e) => {
    // si blocca il comportamento predefinito del browser (che ricaricherebbe
    // l'intera pagina), per gestire l'invio via JavaScript
    e.preventDefault();

    // si eliminano eventuali righe vuote rimaste (es. l'ultimo riquadro,
    // se non è mai stato riempito) prima di inviare i dati
    const cleanedAuthors = authors.filter((author) => author.trim() !== '');
    const cleanedCitations = citations.filter((citation) => citation.trim() !== '');

    // si costruisce l'oggetto finale, nel formato che il service/backend
    // si aspettano di ricevere
    const articleData = {
      title,
      abstract,
      publicationDate,
      doi,
      authors: cleanedAuthors,
      citations: cleanedCitations,
    };

    // si passa l'oggetto pronto a chi ha fornito questo componente
    // (la pagina, che deciderà se chiamare createArticle o updateArticle)
    onSubmit(articleData);
  };


  // si definisce cosa viene effettivamente mostrato a schermo
  return (
    <form onSubmit={handleSubmit} className="article-form">

      <div className="form-group">
        <label htmlFor="title">Titolo</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="abstract">Abstract</label>
        <textarea
          id="abstract"
          value={abstract}
          onChange={(e) => setAbstract(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="publicationDate">Data di pubblicazione</label>
        <input
          type="date"
          id="publicationDate"
          value={publicationDate}
          onChange={(e) => setPublicationDate(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="doi">DOI</label>
        <input
          type="text"
          id="doi"
          value={doi}
          onChange={(e) => setDoi(e.target.value)}
        />
      </div>

      {/* si genera un riquadro per ogni autore presente nell'array,
          incluso quello vuoto finale */}
      <div className="form-section">
        <h3>Autori</h3>
        {authors.map((author, index) => (
          <div key={index} className="dynamic-field">
            <input
              type="text"
              value={author}
              onChange={(e) => handleAuthorChange(index, e.target.value)}
              placeholder="Inserisci un autore"
            />
            {/* si mostra il bottone "Rimuovi" solo sulle righe già
                scritte, non su quella vuota finale */}
            {index < authors.length - 1 && (
              <button type="button" onClick={() => removeAuthor(index)}>
                Rimuovi
              </button>
            )}
          </div>
        ))}
      </div>

      {/* si applica la stessa identica struttura alle citazioni */}
      <div className="form-section">
        <h3>Citazioni</h3>
        {citations.map((citation, index) => (
          <div key={index} className="dynamic-field">
            <input
              type="text"
              value={citation}
              onChange={(e) => handleCitationChange(index, e.target.value)}
              placeholder="Inserisci una citazione"
            />
            {index < citations.length - 1 && (
              <button type="button" onClick={() => removeCitation(index)}>
                Rimuovi
              </button>
            )}
          </div>
        ))}
      </div>

      <button type="submit">Salva articolo</button>
    </form>
  );
};

export default ArticleForm;