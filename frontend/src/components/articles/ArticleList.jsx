import ArticleCard from './ArticleCard';

// creazione della lista di articoli
const ArticleList = ({ articles, onView, onEdit }) => {
  if (!articles || articles.length === 0) {
    return <p>Nessun articolo trovato.</p>;
  }
  
  // si genera una ArticleCard per ogni articolo presente nell'array
  return (
    <div className="article-list">
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          article={article}
          onView={onView}
        />
      ))}
    </div>
  );
};

export default ArticleList;