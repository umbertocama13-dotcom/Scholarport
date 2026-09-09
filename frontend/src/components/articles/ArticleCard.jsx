const ArticleCard = ({ article, onView, onEdit }) => {
  return (
    <div className="article-card">
      <h3>{article.title}</h3>

      <p><strong>DOI:</strong> {article.doi}</p>
      <p><strong>Data:</strong> {article.publication_date ? article.publication_date.split('T')[0] : '—'}</p>

      {article.abstract && <p>{article.abstract}</p>}

      <div>
        <button onClick={() => onView(article.id)}>
          Vedi dettagli
        </button>
      </div>
    </div>
  );
};

export default ArticleCard;


