const citationModel = require('../03-models/citationModel');


// controller per creare una nuova citazione
async function createCitation(req, res) {
  try {
    // prende il testo della citazione dal body
    const { citationText } = req.body;

    // controllo che il campo obbligatorio sia presente
    if (!citationText) {
      return res.status(400).json({
        error: 'citationText è un campo obbligatorio'
      });
    }

    // chiama il model per inserire la citazione
    const citationId = await citationModel.createCitation(citationText);

    return res.status(201).json({
      message: 'Citazione creata con successo',
      citationId
    });

  } catch (error) {
    return res.status(500).json({
      error: 'Errore durante la creazione della citazione',
      details: error.message
    });
  }
}


// controller per ottenere tutte le citazioni
async function getAllCitations(req, res) {
  try {
    const citations = await citationModel.getAllCitations();

    return res.status(200).json(citations);

  } catch (error) {
    return res.status(500).json({
      error: 'Errore durante il recupero delle citazioni',
      details: error.message
    });
  }
}


// controller per ottenere una singola citazione dato l'id
async function getCitationById(req, res) {
  try {
    // req.params.id arriva dall'URL, es. /api/citations/5 -> "5" (stringa)
    const { id } = req.params;

    const citation = await citationModel.getCitationById(id);

    // se il model restituisce null, vuol dire che non esiste nessuna
    // citazione con quell'id: rispondo con 404 (Not Found)
    if (!citation) {
      return res.status(404).json({
        error: 'Citazione non trovata'
      });
    }

    return res.status(200).json(citation);

  } catch (error) {
    return res.status(500).json({
      error: 'Errore durante il recupero della citazione',
      details: error.message
    });
  }
}


// controller per aggiornare una citazione esistente
async function updateCitation(req, res) {
  try {
    const { id } = req.params;
    const { citationText } = req.body;

    if (!citationText) {
      return res.status(400).json({
        error: 'citationText è un campo obbligatorio'
      });
    }

    // il model restituisce true/false a seconda che l'update abbia effettivamente modificato qualcosa
    const updated = await citationModel.updateCitation(id, citationText);

    if (!updated) {
      return res.status(404).json({
        error: 'Citazione non trovata'
      });
    }

    return res.status(200).json({
      message: 'Citazione aggiornata con successo'
    });

  } catch (error) {
    return res.status(500).json({
      error: 'Errore durante l\'aggiornamento della citazione',
      details: error.message
    });
  }
}


// controller per eliminare una citazione
async function deleteCitation(req, res) {
  try {
    const { id } = req.params;

    const deleted = await citationModel.deleteCitation(id);

    if (!deleted) {
      return res.status(404).json({
        error: 'Citazione non trovata'
      });
    }

    return res.status(200).json({
      message: 'Citazione eliminata con successo'
    });

  } catch (error) {
    return res.status(500).json({
      error: 'Errore durante l\'eliminazione della citazione',
      details: error.message
    });
  }
}


module.exports = {
  createCitation,
  getAllCitations,
  getCitationById,
  updateCitation,
  deleteCitation
};