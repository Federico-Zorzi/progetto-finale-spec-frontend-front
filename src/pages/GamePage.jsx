import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useGlobalContext } from "../context/GlobalContext";
import GameCard from "../components/GameCard";

const GamePage = () => {
  const { id } = useParams();
  const { gamesList } = useGlobalContext();
  const navigate = useNavigate();

  const gameSelected = gamesList.find((g) => {
    return g.id === parseInt(id);
  });
  console.log(gameSelected);

  return (
    <>
      <main>
        <section id="game-card-section">
          <button id="back-btn" onClick={() => navigate(`/`)}>
            ← Indietro
          </button>
          <h2>{gameSelected.title}</h2>
          <p>
            Categoria: <span>{gameSelected.category}</span>
          </p>
        </section>
      </main>
    </>
  );
};

export default GamePage;
