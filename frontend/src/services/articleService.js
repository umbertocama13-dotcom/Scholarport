// URL base del backend
const API_BASE_URL = 'http://localhost:3000/api/articles';


// recupera tutti gli articoli
export async function getAllArticles() {
  const response = await fetch(API_BASE_URL);

  // controllo dell'eventuale errore di fetch
  if (!response.ok) {
    throw new Error('Errore nel recupero degli articoli');
  }

  return response.json();
}


// recupera un singolo articolo completo (con autori e citazioni)
export async function getArticleById(id) {
  const response = await fetch(`${API_BASE_URL}/${id}`);

  if (!response.ok) {
    throw new Error('Errore nel recupero dell\'articolo');
  }

  return response.json();
}


// cerca articoli per titolo, doi, year o author
export async function searchArticles(params) {
  // costruisce la query string, es. ?title=sql oppure ?doi=10.1000/sql1
  const queryString = new URLSearchParams(params).toString();

  const response = await fetch(`${API_BASE_URL}/search?${queryString}`);

  if (!response.ok) {
    throw new Error('Errore nella ricerca degli articoli');
  }

  return response.json();
}


// crea un nuovo articolo
export async function createArticle(articleData) {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(articleData)
  });

  if (!response.ok) {
    throw new Error('Errore nella creazione dell\'articolo');
  }

  return response.json();
}


// aggiorna un articolo esistente
export async function updateArticle(id, articleData) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(articleData)
  });

  if (!response.ok) {
    throw new Error('Errore nell\'aggiornamento dell\'articolo');
  }

  return response.json();
}


// elimina un articolo
export async function deleteArticle(id) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    throw new Error('Errore nell\'eliminazione dell\'articolo');
  }

  return response.json();
}


// collega un autore già esistente a un articolo esistente
export async function addAuthorToArticle(articleId, authorId) {
  const response = await fetch(`${API_BASE_URL}/${articleId}/authors`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ authorId })
  });

  if (!response.ok) {
    throw new Error('Errore nel collegamento dell\'autore all\'articolo');
  }

  return response.json();
}


// collega una citazione già esistente a un articolo esistente
export async function addCitationToArticle(articleId, citationId) {
  const response = await fetch(`${API_BASE_URL}/${articleId}/citations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ citationId })
  });

  if (!response.ok) {
    throw new Error('Errore nel collegamento della citazione all\'articolo');
  }

  return response.json();
}