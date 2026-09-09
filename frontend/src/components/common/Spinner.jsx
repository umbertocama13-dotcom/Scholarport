// componente semplice, senza props: mostra un indicatore di caricamento
// da usare ogni volta che una pagina sta aspettando una risposta dal backend
const Spinner = () => {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      <p>Caricamento in corso...</p>
    </div>
  );
};

export default Spinner;