import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const GamePage = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { id } = useParams();
  const navigate = useNavigate();

  const [gameSelected, setGameSelected] = useState();

  const fetchGame = async (id) => {
    try {
      const resGame = await fetch(`${apiUrl}/videogames/${id}`);

      if (!resGame.ok)
        throw new Error(`Errore HTTP ${resGame.status} nel recupero del gioco`);

      const game = await resGame.json();

      if (!game.success)
        throw new Error("Non è stato possibile trovare il gioco");

      return game.videogame;
    } catch (error) {
      console.error(error);
    }
  };
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
            <div>
              <h2>{gameSelected.title}</h2>
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
          )}
        </section>
      </main>
    </>
  );
};

export default GamePage;
