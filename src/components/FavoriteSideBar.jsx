import { useGlobalContext } from "../context/GlobalContext";

const FavoriteSideBar = ({ show = false, onClose }) => {
  const { favoriteGamesList, removeFavoriteGame } = useGlobalContext();
  return (
    <div id="favorite-sidebar-container" className={show ? "" : "hidden"}>
      <div id="favorite-sidebar-header">
        <h3>Lista dei Preferiti</h3>
        <div id="favorite-sidebar-closebtn">
          <button onClick={onClose}>
            <i className="fa-solid fa-xmark fa-2xl"></i>
          </button>
        </div>
      </div>
      <div id="favorite-sidebar-content">
        {favoriteGamesList.length > 0 ? (
          <ul>
            {favoriteGamesList.map((fg, i) => (
              <li key={i} className="favorite-game-item">
                {fg.title}{" "}
                <button
                  className="remove-favorite-game"
                  onClick={() => removeFavoriteGame(fg.id)}
                >
                  <i className="fa-solid fa-square-minus fa-2xl"></i>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Non è presente nessun gioco nella lista dei Preferiti</p>
        )}
      </div>
    </div>
  );
};

export default FavoriteSideBar;
