const API_BASE_URL = 'http://localhost:3000/api/citations';


// GET /api/citations -> recupera tutte le citazioni
export async function getAllCitations() {
  const response = await fetch(API_BASE_URL);

  if (!response.ok) {
    throw new Error('Errore nel recupero delle citazioni');
  }

  return response.json();
}


// GET /api/citations/:id -> recupera una singola citazione
export async function getCitationById(id) {
  const response = await fetch(`${API_BASE_URL}/${id}`);

  if (!response.ok) {
    throw new Error('Errore nel recupero della citazione');
  }

  return response.json();
}


// POST /api/citations -> crea una nuova citazione
export async function createCitation(citationText) {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ citationText })
  });

  if (!response.ok) {
    throw new Error('Errore nella creazione della citazione');
  }

  return response.json();
}


// PUT /api/citations/:id -> aggiorna il testo di una citazione esistente
export async function updateCitation(id, citationText) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ citationText })
  });

  if (!response.ok) {
    throw new Error('Errore nell\'aggiornamento della citazione');
  }

  return response.json();
}


// DELETE /api/citations/:id -> elimina una citazione
export async function deleteCitation(id) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    throw new Error('Errore nell\'eliminazione della citazione');
  }

  return response.json();
}