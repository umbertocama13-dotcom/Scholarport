import { useState } from 'react';
import ArticleForm from './ArticleForm';

// questo componente riceve un articolo COMPLETO (con authors e citations già inclusi, quindi ci si aspetta 
// che chi lo usa abbia già chiamato getArticleById, non getAllArticles)
// "onUpdate" è la funzione da chiamare quando l'utente salva le modifiche
const ArticleDetails = ({ article, onUpdate, onDelete }) => {

  // si tiene traccia di quale modalità è attiva: visualizzazione o modifica
  // si parte sempre in modalità visualizzazione
  const [isEditing, setIsEditing] = useState(false);

  // funzione chiamata quando l'utente conferma le modifiche nel form
  const handleFormSubmit = (updatedData) => {
    // si passa il lavoro alla pagina, che sa come chiamare il service
    // (updateArticle) e gestire eventuali errori
    onUpdate(article.id, updatedData);

    // si torna in modalità visualizzazione dopo il salvataggio
    setIsEditing(false);
  };

  // funcione che gestisce il pulsante "elimina"
  const handleDeleteClick = () => {
    const confirmed = window.confirm(
      `Sei sicuro di voler eliminare "${article.title}"? L'azione non è reversibile.`
    );

    if (confirmed) {
      onDelete(article.id);
    }
  };


  // se siamo in modalità modifica, si mostra il form al posto della
  // visualizzazione normale, precompilato con i dati attuali dell'articolo
  if (isEditing) {
    return (
      <div className="article-details">
        <h2>Modifica articolo</h2>

        <ArticleForm
          initialData={article}
          onSubmit={handleFormSubmit}
        />

        {/* si dà la possibilità di annullare la modifica e tornare
            semplicemente alla visualizzazione, senza salvare nulla */}
        <button type="button" onClick={() => setIsEditing(false)}>
          Annulla
        </button>
      </div>
    );
  }

  // modalità visualizzazione (quella di default)
  return (
    <div className="article-details">

      <h2>{article.title}</h2>

      <p><strong>DOI:</strong> {article.doi}</p>

      {/* si taglia la parte oraria della data, tenendo solo YYYY-MM-DD,
          per una visualizzazione più pulita */}
      <p>
        <strong>Data di pubblicazione:</strong>{' '}
        {article.publication_date ? article.publication_date.split('T')[0] : '—'}
      </p>

      {/* si mostra l'abstract solo se effettivamente presente */}
      {article.abstract && (
        <div>
          <h3>Abstract</h3>
          <p>{article.abstract}</p>
        </div>
      )}

      <div>
        <h3>Autori</h3>
        {/* si gestisce il caso in cui non ci siano autori collegati */}
        {article.authors && article.authors.length > 0 ? (
          <ul>
            {article.authors.map((author) => (
              // qui si può usare author.id come key, perché è un valore
              // stabile e univoco fornito dal database (a differenza
              // dell'index, che avrebbe comunque funzionato ma è meno robusto)
              <li key={author.id}>{author.name}</li>
            ))}
          </ul>
        ) : (
          <p>Nessun autore collegato.</p>
        )}
      </div>

      <div>
        <h3>Citazioni</h3>
        {article.citations && article.citations.length > 0 ? (
          <ul>
            {article.citations.map((citation) => (
              <li key={citation.id}>{citation.citation_text}</li>
            ))}
          </ul>
        ) : (
          <p>Nessuna citazione collegata.</p>
        )}
      </div>

      {/* il click su questo bottone fa passare il componente in
          modalità modifica, mostrando ArticleForm al posto di questa vista */}
      <button type="button" onClick={() => setIsEditing(true)}>
        Modifica
      </button>
      <button type="button" className="button--danger" onClick={handleDeleteClick}>
          Elimina
      </button>
    </div>
  );
};

export default ArticleDetails;