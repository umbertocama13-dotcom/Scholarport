import { useState } from 'react';

// questo componente gestisce tutti e quattro i filtri: title (parziale), doi (esatto), year (esatto), author (parziale)
const ArticleFilters = ({ onFilter }) => {
  const [title, setTitle] = useState('');
  const [doi, setDoi] = useState('');
  const [year, setYear] = useState('');
  const [author, setAuthor] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter({ title, doi, year, author });
  };

  const handleReset = () => {
    setTitle('');
    setDoi('');
    setYear('');
    setAuthor('');
    onFilter({ title: '', doi: '', year: '', author: '' });
  };

  return (
    <form className="article-filters" onSubmit={handleSubmit}>
      <div className="filter-group">
        <label htmlFor="title">Titolo</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Cerca per titolo"
        />
      </div>

      <div className="filter-group">
        <label htmlFor="author">Autore</label>
        <input
          type="text"
          id="author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Cerca per autore"
        />
      </div>

      <div className="filter-group">
        <label htmlFor="year">Anno</label>
        <input
          type="number"
          id="year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="2024"
        />
      </div>

      <div className="filter-group">
        <label htmlFor="doi">DOI</label>
        <input
          type="text"
          id="doi"
          value={doi}
          onChange={(e) => setDoi(e.target.value)}
          placeholder="Cerca per DOI"
        />
      </div>

      <div className="filter-actions">
        <button type="submit">Filtra</button>
        <button type="button" onClick={handleReset}>
          Reset
        </button>
      </div>
    </form>
  );
};

export default ArticleFilters;