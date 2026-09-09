import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createArticle } from '../services/articleService';
import ArticleForm from '../components/articles/ArticleForm';

const ArticleFormPage = () => {
  const navigate = useNavigate();

  // si tiene traccia di un eventuale errore durante la creazione,
  // per poterlo mostrare all'utente senza far sparire il form compilato
  const [error, setError] = useState(null);

  // funzione passata ad ArticleForm: viene chiamata quando l'utente
  // invia il form compilato
  const handleSubmit = async (articleData) => {
    setError(null);

    try {
      const result = await createArticle(articleData);

      // dopo la creazione, si naviga direttamente al dettaglio del
      // nuovo articolo appena creato, usando l'id restituito dal backend
      navigate(`/articles/${result.articleId}`);
    } catch (err) {
      // se qualcosa va storto (es. DOI duplicato, già visto durante
      // i test su Postman), si mostra l'errore SENZA cambiare pagina,
      // così l'utente non perde quello che ha già scritto
      setError('Errore durante la creazione dell\'articolo. Controlla i dati inseriti (es. DOI già esistente).');
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="article-form-page">
      <h1>Nuovo articolo</h1>

      {error && <p className="error-message">{error}</p>}

      {/* initialData non viene passato (resta undefined), così
          ArticleForm si comporta in modalità "creazione": tutti
          i campi partono vuoti, coerente con la logica già scritta
          dentro il suo useEffect (if (initialData) {...}) */}
      <ArticleForm onSubmit={handleSubmit} />

      <button type="button" onClick={handleCancel}>
        Annulla
      </button>
    </div>
  );
};

export default ArticleFormPage;