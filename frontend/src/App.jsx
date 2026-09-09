import './App.css';

// BrowserRouter abilita il routing basato sull'URL del browser, Routes/Route servono a
// definire quale pagina mostrare per ciascun percorso
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ArticlePage from './pages/ArticlePage';
import ArticleFormPage from './pages/ArticleFormPage';
import NotFoundPage from './pages/NotFoundPage';


function App() {
  return (
    <div className="app">
      <div className="app__container">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* percorso SPECIFICO "/articles/new": va dichiarato PRIMA di
            "/articles/:id", altrimenti React Router interpreterebbe
            "new" come se fosse un id */}
            <Route path="/articles/new" element={<ArticleFormPage />} />
            <Route path="/articles/:id" element={<ArticlePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;