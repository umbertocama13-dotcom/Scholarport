import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getArticleById, updateArticle, deleteArticle } from '../services/articleService';
import ArticleDetails from '../components/articles/ArticleDetails';
import Spinner from '../components/common/Spinner';

const ArticlePage = () => {
  // useParams legge i parametri presenti nell'URL corrente, definiti
  // nella route (es. "/articles/:id"). Se l'URL è "/articles/5", qui "id" varrà la stringa "5"
  const { id } = useParams();

  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // funzione che carica l'articolo specifico, usata sia al primo
  // caricamento sia dopo un salvataggio (per mostrare i dati aggiornati)
  const loadArticle = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getArticleById(id);
      setArticle(data);
    } catch (err) {
      setError('Impossibile caricare l\'articolo richiesto.');
    } finally {
      setLoading(false);
    }
  };

  // si ricarica l'articolo ogni volta che "id" cambia (es. se si
  // naviga da un dettaglio a un altro senza passare dalla home)
  useEffect(() => {
    loadArticle();
  }, [id]);

  // funzione passata ad ArticleDetails: viene chiamata quando l'utente
  // salva le modifiche nel form di modifica
  const handleUpdate = async (articleId, updatedData) => {
    try {
      await updateArticle(articleId, updatedData);
      // dopo il salvataggio, si ricaricano i dati freschi dal backend,
      // così si mostrano subito autori/citazioni aggiornati
      await loadArticle();
    } catch (err) {
      setError('Errore durante il salvataggio delle modifiche.');
    }
  };


   // elimina l'articolo, poi torna alla lista
  const handleDelete = async (articleId) => {
    try {
      await deleteArticle(articleId);
      navigate('/');
    } catch (err) {
      setError('Errore durante l\'eliminazione dell\'articolo.');
    }
  };


  // consente di tornare alla lista articoli
  const handleBack = () => {
    navigate('/');
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div>
        <p className="error-message">{error}</p>
        <button type="button" onClick={handleBack}>
          Torna alla lista
        </button>
      </div>
    );
  }

  // caso limite: la fetch è andata a buon fine ma non ha trovato
  // nessun articolo (es. id inesistente, il backend risponde 404)
  if (!article) {
    return (
      <div>
        <p>Articolo non trovato.</p>
        <button type="button" onClick={handleBack}>
          Torna alla lista
        </button>
      </div>
    );
  }

  return (
    <div className="article-page">
      <button type="button" onClick={handleBack}>
        ← Torna alla lista
      </button>

      {/* si passano le prop */}
      <ArticleDetails article={article} onUpdate={handleUpdate} onDelete={handleDelete} />
    </div>
  );
};

export default ArticlePage;