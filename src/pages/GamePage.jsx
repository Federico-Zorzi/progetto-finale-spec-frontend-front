import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGlobalContext } from "../context/GlobalContext";

import Modal from "../components/Modal";
import EditGameModal from "../components/EditGameModal.jsx";

const GamePage = () => {
  const {
    fetchGame,
    removeGame,
    updateGame,
    favoriteGamesList,
    addFavoriteGame,
    removeFavoriteGame,
  } = useGlobalContext();
  const { id } = useParams();
  const navigate = useNavigate();

  const [gameSelected, setGameSelected] = useState();

  const [errorMsg, setErrorMsg] = useState("");
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  /* modals visualization */
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);
  const [isShowUpdateModal, setIsShowUpdateModal] = useState(false);

  /* fetch game data */
  useEffect(() => {
    fetchGame(id).then((data) => setGameSelected(data));
  }, [id]);

  /* delete game function */
  const handleGameDelete = (gameId) => {
    setErrorMsg("");

    removeGame(gameId)
      .then((data) => navigate(`/`))
      .catch((error) => setErrorMsg(error.message));
  };

  /* update game function */
  const handleGameUpdate = (e, gameId, gameModified) => {
    e.preventDefault();
    setErrorMsg("");

    updateGame(gameId, gameModified)
      .then((data) => setGameSelected(data.videogame))
      .catch((error) => setErrorMsg(error.message));
  };

  return (
    <main>
      <section id="game-card-section">
        <div id="detail-game-btns">
          {/* navigate back button */}
          <button id="back-btn" onClick={() => navigate(`/`)}>
            ← Indietro
          </button>

          <div id="update-games-list-btns">
            {/* update game button */}
            <button id="update-btn" onClick={() => setIsShowUpdateModal(true)}>
              <i className="fa-solid fa-pen fa-lg"></i>
            </button>

            {/* detele game button */}
            <button id="delete-btn" onClick={() => setIsShowDeleteModal(true)}>
              <i className="fa-solid fa-trash fa-lg"></i>
            </button>
          </div>
        </div>

        {/* alert for error message */}
        {errorMsg && (
          <div className="error-alert">
            <p>{errorMsg}</p>
          </div>
        )}

        {/* game selected card */}
        {gameSelected && (
          <>
            {/* title and star button */}
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

            {/* game informations */}
            <div id="game-detail-content">
              <div id="game-information">
                <ul id="game-information-list">
                  <li className="game-information-item">
                    CATEGORIA: <span>{gameSelected.category}</span>
                  </li>
                  {gameSelected.subCategories && (
                    <li className="game-information-item">
                      SOTTOCATEGORIA:{" "}
                      <span>{gameSelected.subCategories.join(", ")}</span>
                    </li>
                  )}
                  <li className="game-information-item">
                    SVILUPPATORE: {gameSelected.softwareHouse.name}
                  </li>
                  <li className="game-information-item">
                    PIATTAFORME: {gameSelected.platforms.join(", ")}
                  </li>
                  <li className="game-information-item">
                    MODALITA' DI GIOCO: {gameSelected.gameModes.join(", ")}
                  </li>

                  {gameSelected.description && (
                    <li className="game-information-item">
                      {gameSelected.description}
                    </li>
                  )}
                </ul>
              </div>
              <div id="game-specific-info">
                <p className="game-information-item">
                  Data di rilascio:{" "}
                  <span>
                    {dayjs(gameSelected.releaseDate).format("DD/MM/YYYY")}
                  </span>
                </p>

                <p className="game-information-item">
                  Prezzo:{" "}
                  {gameSelected.price ? (
                    <span>{gameSelected.price}€</span>
                  ) : (
                    <span>Gratis</span>
                  )}
                </p>

                <details id="ratings-detail">
                  <summary
                    onClick={() => setIsDetailOpen((curr) => !curr)}
                    className={!isDetailOpen ? "closed" : "open"}
                  >
                    Valutazioni
                  </summary>
                  {gameSelected.ratings ? (
                    <ul>
                      {gameSelected.ratings.map((rate, i) => (
                        <li key={i}>
                          <span className="name-rating">{rate.source}</span> -{" "}
                          {rate.score}/100
                        </li>
                      ))}
                    </ul>
                  ) : (
                    "Nessuna valutazione"
                  )}
                </details>
              </div>
            </div>
          </>
        )}
      </section>

      {/* Modal update game */}
      <EditGameModal
        show={isShowUpdateModal}
        onClose={() => setIsShowUpdateModal(false)}
        game={gameSelected}
        platforms={gameSelected && gameSelected.platforms}
        gamemodes={gameSelected && gameSelected.gameModes}
        onSave={handleGameUpdate}
      />

      {/* Modal delete game */}
      <Modal
        title={"Elimina gioco"}
        content={"Vuoi eliminare il gioco selezionato?"}
        show={isShowDeleteModal}
        onClose={() => setIsShowDeleteModal(false)}
        onConfirm={() => {
          handleGameDelete(id);
          removeFavoriteGame(parseInt(id));
          setIsShowDeleteModal(false);
        }}
        confirmButton={{
          confirmText: "Conferma",
          confirmColor: "#f44336",
          buttonType: "button",
        }}
      />
    </main>
  );
};

export default GamePage;
