const express = require('express');
const router = express.Router();

const authorController = require('../01-controllers/authorController');

// GET /api/authors → lista di tutti gli autori
router.get('/', authorController.getAllAuthors);

// GET /api/authors/:id → un singolo autore dato l'id
router.get('/:id', authorController.getAuthorById);

// POST /api/authors → crea un autore (o riusa quello esistente, gestito da findOrCreateAuthor)
router.post('/', authorController.createAuthor);

// PUT /api/authors/:id → aggiorna il nome di un autore esistente
router.put('/:id', authorController.updateAuthor);

// DELETE /api/authors/:id → elimina un autore
router.delete('/:id', authorController.deleteAuthor);

module.exports = router;