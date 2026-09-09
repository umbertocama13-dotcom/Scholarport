const authorModel = require('../03-models/authorModel');


// controller per creare un autore (o riusarlo se già esiste)
async function createAuthor(req, res) {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        error: 'name è un campo obbligatorio'
      });
    }

    // uso findOrCreateAuthor di authorModel (esegue anche controllo)
    const authorId = await authorModel.findOrCreateAuthor(name);

    return res.status(201).json({
      message: 'Autore creato o già esistente',
      authorId
    });

  } catch (error) {
    return res.status(500).json({
      error: 'Errore durante la creazione dell\'autore',
      details: error.message
    });
  }
}


// controller per ottenere tutti gli autori
async function getAllAuthors(req, res) {
  try {
    const authors = await authorModel.getAllAuthors();

    return res.status(200).json(authors);

  } catch (error) {
    return res.status(500).json({
      error: 'Errore durante il recupero degli autori',
      details: error.message
    });
  }
}


// controller per ottenere un singolo autore dato l'id
async function getAuthorById(req, res) {
  try {
    const { id } = req.params;

    const author = await authorModel.getAuthorById(id);

    if (!author) {
      return res.status(404).json({
        error: 'Autore non trovato'
      });
    }

    return res.status(200).json(author);

  } catch (error) {
    return res.status(500).json({
      error: 'Errore durante il recupero dell\'autore',
      details: error.message
    });
  }
}


// controller per aggiornare il nome di un autore
async function updateAuthor(req, res) {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        error: 'name è un campo obbligatorio'
      });
    }

    const updated = await authorModel.updateAuthor(id, name);
 
    if (!updated) {
      return res.status(409).json({
        error: 'Autore non trovato oppure nome già esistente per un altro autore'
      });
    }

    return res.status(200).json({
      message: 'Autore aggiornato con successo'
    });

  } catch (error) {
    return res.status(500).json({
      error: 'Errore durante l\'aggiornamento dell\'autore',
      details: error.message
    });
  }
}


// controller per eliminare un autore
async function deleteAuthor(req, res) {
  try {
    const { id } = req.params;

    const deleted = await authorModel.deleteAuthor(id);

    if (!deleted) {
      return res.status(404).json({
        error: 'Autore non trovato'
      });
    }

    return res.status(200).json({
      message: 'Autore eliminato con successo'
    });

  } catch (error) {
    return res.status(500).json({
      error: 'Errore durante l\'eliminazione dell\'autore',
      details: error.message
    });
  }
}


module.exports = {
  createAuthor,
  getAllAuthors,
  getAuthorById,
  updateAuthor,
  deleteAuthor
};