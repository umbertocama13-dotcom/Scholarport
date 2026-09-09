const articleModel = require('../03-models/articleModel');


// controller per creare un nuovo articolo completo
async function createArticle(req, res) {
  try {
    const articleData = req.body;

    // controlla minimo dei campi obbligatori
    if (!articleData.title || !articleData.doi) {
      return res.status(400).json({
        error: 'title e doi sono campi obbligatori'
      });
    }

    // spacchetta l'oggetto nei parametri richiesti dal model, nell'ordine giusto
    const articleId = await articleModel.createArticle(
      articleData.title,
      articleData.abstract,
      articleData.publicationDate,
      articleData.doi,
      articleData.authors || [],
      articleData.citations || []
    );

    return res.status(201).json({
      message: 'Articolo creato con successo',
      articleId
    });

  } catch (error) {
    return res.status(500).json({
      error: 'Errore durante la creazione dell\'articolo',
      details: error.message
    });
  }
}


// controller per ottenere tutti gli articoli (senza dettagli autori/citazioni,
// solo i dati base per una lista/panoramica)
async function getAllArticles(req, res) {
  try {
    const articles = await articleModel.getAllArticles();

    return res.status(200).json(articles);

  } catch (error) {
    return res.status(500).json({
      error: 'Errore durante il recupero degli articoli',
      details: error.message
    });
  }
}


// controller per ottenere un singolo articolo COMPLETO:
// dati base + autori collegati + citazioni collegate (utile per la pagina di dettaglio di un articolo nel frontend)
async function getArticleById(req, res) {
  try {
    const { id } = req.params;

    const article = await articleModel.getArticleById(id);

    if (!article) {
      return res.status(404).json({
        error: 'Articolo non trovato'
      });
    }

    // eseguo le due chiamate per autori e citazioni SOLO se l'articolo esiste
    // Promise.all esegue le due richieste IN PARALLELO invece che una dopo l'altra, così risparmio tempo (le due query non dipendono l'una dall'altra)
    const [authors, citations] = await Promise.all([
      articleModel.getArticleAuthors(id),
      articleModel.getArticleCitations(id)
    ]);

    // costruisco un unico oggetto di risposta che combina tutto
    return res.status(200).json({
        id: article.id,
        title: article.title,
        abstract: article.abstract,
        publication_date: article.publication_date,
        doi: article.doi,
        authors: authors,
        citations: citations
    });

  } catch (error) {
    return res.status(500).json({
      error: 'Errore durante il recupero dell\'articolo',
      details: error.message
    });
  }
}


// controller per cercare articoli per titolo, doi, anno o autore
// esempio di chiamata: GET /api/articles/search?title=sql
// oppure: GET /api/articles/search?author=rossi
async function searchArticles(req, res) {
  try {
    const { title, doi, year, author } = req.query;

    if (doi) {
      const article = await articleModel.findArticleByDoi(doi);

      if (!article) {
        return res.status(404).json({ error: 'Nessun articolo trovato con questo DOI' });
      }

      return res.status(200).json([article]);
    }

    if (title) {
      const articles = await articleModel.findArticleByTitle(title);
      return res.status(200).json(articles);
    }

    if (year) {
      const articles = await articleModel.findArticleByYear(year);
      return res.status(200).json(articles);
    }

    if (author) {
      const articles = await articleModel.findArticleByAuthor(author);
      return res.status(200).json(articles);
    }

    return res.status(400).json({
      error: 'Specificare almeno un parametro di ricerca: title, doi, year o author'
    });

  } catch (error) {
    return res.status(500).json({
      error: 'Errore durante la ricerca degli articoli',
      details: error.message
    });
  }
}


// controller per aggiornare i dati di un articolo
async function updateArticle(req, res) {
  try {
    const { id } = req.params;
    const { title, abstract, publicationDate, doi, authors, citations } = req.body;

    if (!title || !doi) {
      return res.status(400).json({
        error: 'title e doi sono campi obbligatori'
      });
    }

    const updated = await articleModel.updateArticle(
      id, title, abstract, publicationDate, doi,
      authors || [], citations || []
    );

    if (!updated) {
      return res.status(404).json({
        error: 'Articolo non trovato'
      });
    }

    return res.status(200).json({
      message: 'Articolo aggiornato con successo'
    });

  } catch (error) {
    return res.status(500).json({
      error: 'Errore durante l\'aggiornamento dell\'articolo',
      details: error.message
    });
  }
}


// controller per eliminare un articolo
async function deleteArticle(req, res) {
  try {
    const { id } = req.params;

    const deleted = await articleModel.deleteArticle(id);

    if (!deleted) {
      return res.status(404).json({
        error: 'Articolo non trovato'
      });
    }

    return res.status(200).json({
      message: 'Articolo eliminato con successo'
    });

  } catch (error) {
    return res.status(500).json({
      error: 'Errore durante l\'eliminazione dell\'articolo',
      details: error.message
    });
  }
}


// controller per collegare un autore GIÀ ESISTENTE a un articolo esistente
// (es. l'utente vuole aggiungere un autore a un articolo già creato, senza dover ricreare tutto l'articolo da capo)
async function addAuthorToArticle(req, res) {
  try {
    const { id } = req.params; // id dell'articolo, dall'URL
    const { authorId } = req.body; // id dell'autore da collegare, dal body

    if (!authorId) {
      return res.status(400).json({
        error: 'authorId è un campo obbligatorio'
      });
    }

    // si usa linkAuthorToArticle SENZA passare "executor":
    // di conseguenza userà il valore di default (pool), non una transazione, perché questa è un'operazione singola e indipendente
    await articleModel.linkAuthorToArticle(id, authorId);

    return res.status(201).json({
      message: 'Autore collegato all\'articolo con successo'
    });

  } catch (error) {
    return res.status(500).json({
      error: 'Errore durante il collegamento dell\'autore',
      details: error.message
    });
  }
}


// controller per collegare una citazione GIÀ ESISTENTE a un articolo esistente
async function addCitationToArticle(req, res) {
  try {
    const { id } = req.params;
    const { citationId } = req.body;

    if (!citationId) {
      return res.status(400).json({
        error: 'citationId è un campo obbligatorio'
      });
    }

    await articleModel.linkCitationToArticle(id, citationId);

    return res.status(201).json({
      message: 'Citazione collegata all\'articolo con successo'
    });

  } catch (error) {
    return res.status(500).json({
      error: 'Errore durante il collegamento della citazione',
      details: error.message
    });
  }
}


module.exports = {
  createArticle,
  getAllArticles,
  getArticleById,
  searchArticles,
  updateArticle,
  deleteArticle,
  addAuthorToArticle,
  addCitationToArticle
};