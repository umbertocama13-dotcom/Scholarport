const API_BASE_URL = 'http://localhost:3000/api/authors';


// GET /api/authors -> recupera tutti gli autori
export async function getAllAuthors() {
  const response = await fetch(API_BASE_URL);

  if (!response.ok) {
    throw new Error('Errore nel recupero degli autori');
  }

  return response.json();
}


// GET /api/authors/:id -> recupera un singolo autore
export async function getAuthorById(id) {
  const response = await fetch(`${API_BASE_URL}/${id}`);

  if (!response.ok) {
    throw new Error('Errore nel recupero dell\'autore');
  }

  return response.json();
}


// POST /api/authors -> crea un autore (o riusa quello esistente)
export async function createAuthor(name) {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  });

  if (!response.ok) {
    throw new Error('Errore nella creazione dell\'autore');
  }

  return response.json();
}


// PUT /api/authors/:id -> aggiorna il nome di un autore
export async function updateAuthor(id, name) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  });

  if (!response.ok) {
    throw new Error('Errore nell\'aggiornamento dell\'autore');
  }

  return response.json();
}


// DELETE /api/authors/:id -> elimina un autore
export async function deleteAuthor(id) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    throw new Error('Errore nell\'eliminazione dell\'autore');
  }

  return response.json();
}