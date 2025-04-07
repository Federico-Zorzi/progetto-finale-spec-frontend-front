import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGlobalContext } from "../context/GlobalContext";

const GamePage = () => {
  const { fetchGame, favoriteGamesList, addFavoriteGame, removeFavoriteGame } =
    useGlobalContext();
  const { id } = useParams();
  const navigate = useNavigate();

  const [gameSelected, setGameSelected] = useState();

  useEffect(() => {
    fetchGame(id).then((data) => setGameSelected(data));
  }, []);

  return (
    <>
      <main>
        <section id="game-card-section">
          <button id="back-btn" onClick={() => navigate(`/`)}>
            ← Indietro
          </button>
          {gameSelected && (
            <>
              <div id="game-detail-header">
                <button
                  onClick={() => {
                    if (
                      !favoriteGamesList.some(
                        (game) => game.id === gameSelected.id
                      )
                    )
                      addFavoriteGame(gameSelected);
                    else removeFavoriteGame(gameSelected.id);
                  }}
                  className="favorite-game-detail-btn"
                >
                  <i
                    className={
                      (favoriteGamesList.some(
                        (game) => game.id === gameSelected.id
                      )
                        ? "fa-solid"
                        : "fa-regular") + " fa-star fa-xl"
                    }
                  ></i>
                </button>
                <h2>{gameSelected.title}</h2>
              </div>
              <div>
                <p>
                  Data di rilascio:{" "}
                  <span>
                    {dayjs(gameSelected.releaseDate).format("DD/MM/YYYY")}
                  </span>
                </p>
                <p>Casa di produzione: {gameSelected.softwareHouse.name}</p>
                <p>
                  Categoria: <span>{gameSelected.category}</span>
                </p>
                {gameSelected.subCategories && (
                  <p>
                    Sottocategoria:{" "}
                    <span>{gameSelected.subCategories.join(", ")}</span>
                  </p>
                )}
                <p>
                  Prezzo:{" "}
                  {gameSelected.price ? (
                    <span>{gameSelected.price}€</span>
                  ) : (
                    "Gratis"
                  )}
                </p>
                <p>Piattaforme: {gameSelected.platforms.join(", ")}</p>
                <p>Modalità di gioco: {gameSelected.gameModes.join(", ")}</p>

                {gameSelected.description && (
                  <p>Descrizione: {gameSelected.description}</p>
                )}
                {gameSelected.ratings && (
                  <details>
                    <summary>Valutazioni</summary>
                    <ul>
                      {gameSelected.ratings.map((rate, i) => (
                        <li key={i}>
                          {rate.source} - score: {rate.score}/100
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
              </div>
            </>
          )}
        </section>
      </main>
    </>
  );
};

export default GamePage;
