const express = require('express');
const router = express.Router();

const citationController = require('../01-controllers/citationController');

// GET /api/citations → lista di tutte le citazioni
router.get('/', citationController.getAllCitations);

// GET /api/citations/:id → una singola citazione dato l'id
router.get('/:id', citationController.getCitationById);

// POST /api/citations → crea una nuova citazione
router.post('/', citationController.createCitation);

// PUT /api/citations/:id → aggiorna il testo di una citazione esistente
router.put('/:id', citationController.updateCitation);

// DELETE /api/citations/:id → elimina una citazione
router.delete('/:id', citationController.deleteCitation);

module.exports = router;