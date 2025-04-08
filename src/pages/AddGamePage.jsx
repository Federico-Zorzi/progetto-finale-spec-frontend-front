import { useNavigate } from "react-router-dom";

const AddGamePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <main>
        <section id="add-game-section">
          <button id="back-btn" onClick={() => navigate(`/`)}>
            ← Indietro
          </button>
        </section>
      </main>
    </>
  );
};

export default AddGamePage;
