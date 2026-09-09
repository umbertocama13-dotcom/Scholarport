const express = require('express');
const router = express.Router();
const articleController = require('../01-controllers/articleController');

// GET /api/articles/search?title=... oppure ?doi=...
// DEVE stare PRIMA di /:id, altrimenti Express interpreterebbe "search" come un id
router.get('/search', articleController.searchArticles);

// GET /api/articles → lista di tutti gli articoli
router.get('/', articleController.getAllArticles);

// GET /api/articles/:id → un singolo articolo completo (con autori e citazioni)
router.get('/:id', articleController.getArticleById);

// POST /api/articles → crea un nuovo articolo
router.post('/', articleController.createArticle);

// PUT /api/articles/:id → aggiorna un articolo esistente
router.put('/:id', articleController.updateArticle);

// DELETE /api/articles/:id → elimina un articolo
router.delete('/:id', articleController.deleteArticle);

// POST /api/articles/:id/authors → collega un autore esistente a un articolo
router.post('/:id/authors', articleController.addAuthorToArticle);

// POST /api/articles/:id/citations → collega una citazione esistente a un articolo
router.post('/:id/citations', articleController.addCitationToArticle);

module.exports = router;