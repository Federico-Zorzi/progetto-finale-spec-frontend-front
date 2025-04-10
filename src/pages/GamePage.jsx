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

  /* MODAL VIS */
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);
  const [isShowUpdateModal, setIsShowUpdateModal] = useState(false);

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

    console.log(gameModified);

    updateGame(gameId, gameModified)
      .then((data) => fetchGame(id).then((data) => setGameSelected(data)))
      .catch((error) => setErrorMsg(error.message));
  };

  return (
    <>
      <main>
        <section id="game-card-section">
          <div id="detail-game-btns">
            {/* navigate back button */}
            <button id="back-btn" onClick={() => navigate(`/`)}>
              ← Indietro
            </button>

            <div id="update-games-list-btns">
              {/* update game button */}
              <button
                id="update-btn"
                onClick={() => setIsShowUpdateModal(true)}
              >
                <i className="fa-solid fa-pen fa-lg"></i>
              </button>

              {/* detele game button */}
              <button
                id="delete-btn"
                onClick={() => setIsShowDeleteModal(true)}
              >
                <i className="fa-solid fa-trash fa-lg"></i>
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="error-alert">
              <p>{errorMsg}</p>
            </div>
          )}

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
                  DATA DI RILASCIO:{" "}
                  <span>
                    {dayjs(gameSelected.releaseDate).format("DD/MM/YYYY")}
                  </span>
                </p>
                <p>
                  PREZZO:{" "}
                  {gameSelected.price ? (
                    <span>{gameSelected.price}€</span>
                  ) : (
                    <span>Gratis</span>
                  )}
                </p>
                <p>
                  CATEGORIA: <span>{gameSelected.category}</span>
                </p>
                {gameSelected.subCategories && (
                  <p>
                    SOTTOCATEGORIA:{" "}
                    <span>{gameSelected.subCategories.join(", ")}</span>
                  </p>
                )}
                <p>SVILUPPATORE: {gameSelected.softwareHouse.name}</p>
                <p>PIATTAFORME: {gameSelected.platforms.join(", ")}</p>
                <p>MODALITA' DI GIOCO: {gameSelected.gameModes.join(", ")}</p>

                {gameSelected.description && <p>{gameSelected.description}</p>}
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
            setIsShowDeleteModal(false);
          }}
          confirmButton={{
            confirmText: "Conferma",
            confirmColor: "#f44336",
            buttonType: "button",
          }}
        />
      </main>
    </>
  );
};

export default GamePage;
