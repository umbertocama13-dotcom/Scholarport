import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllArticles, searchArticles } from '../services/articleService';
import ArticleList from '../components/articles/ArticleList';
import ArticleFilters from '../components/articles/ArticleFilters';
import Spinner from '../components/common/Spinner';

const HomePage = () => {
  // si tengono in memoria gli articoli, lo stato di caricamento
  // ed eventuali errori, così la pagina può reagire di conseguenza
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // permette di cambiare pagina/URL da codice, non solo tramite click su un link — lo useremo dentro "onView/onEdit"
  const navigate = useNavigate();

  // funzione che carica TUTTI gli articoli, usata sia al primo 
  // caricamento della pagina sia quando l'utente resetta i filtri
  const loadAllArticles = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getAllArticles();
      setArticles(data);
    } catch (err) {
      setError('Impossibile caricare gli articoli. Riprova più tardi.');
    } finally {
      setLoading(false);
    }
  };

  // si esegue una sola volta, al primo caricamento della pagina
  // (l'array vuoto [] alla fine indica "esegui solo al montaggio")
  useEffect(() => {
    loadAllArticles();
  }, []);

  // funzione passata ad ArticleFilters: viene chiamata quando l'utente invia il form di ricerca
  const handleFilter = async (filters) => {
    // se TUTTI i campi sono vuoti (es. dopo un reset), si ricarica semplicemente la lista completa, senza passare da searchArticles
    const isEmpty = Object.values(filters).every((value) => value.trim() === '');

    if (isEmpty) {
      loadAllArticles();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // si tolgono i campi vuoti prima di inviarli, così la query
      // string generata da URLSearchParams resta pulita
      const cleanedFilters = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value.trim() !== '')
      );

      const data = await searchArticles(cleanedFilters);
      setArticles(data);
    } catch (err) {
      setError('Nessun risultato trovato o errore nella ricerca.');
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  // al click su "Vedi dettagli" di una card, si naviga verso la
  // pagina di dettaglio di quell'articolo specifico
  const handleView = (id) => {
    navigate(`/articles/${id}`);
  };

  // il pulsante "Modifica" porta anch'esso al dettaglio: sarà quella
  // pagina a gestire il passaggio in modalità modifica (tramite il
  // pulsante "Modifica" già presente dentro ArticleDetails)
  const handleEdit = (id) => {
    navigate(`/articles/${id}`);
  };

  // al click sul pulsante "Nuovo articolo", si naviga verso il form
  // di creazione (pagina separata, non ancora scritta)
  const handleCreateNew = () => {
    navigate('/articles/new');
  };

  return (
    <div className="home-page">
      <div className="home-header">
        <h1>ScholarPort</h1>
        <button type="button" onClick={handleCreateNew}>
          + Nuovo articolo
        </button>
      </div>

      <ArticleFilters onFilter={handleFilter} />

      {/* si mostra lo spinner mentre si aspetta la risposta del backend,
          altrimenti si mostra un eventuale errore, altrimenti la lista */}
      {loading ? (
        <Spinner />
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <ArticleList
          articles={articles}
          onView={handleView}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
};

export default HomePage;