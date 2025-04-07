import { useCallback, useEffect, useMemo, useState } from "react";

import { useGlobalContext } from "../context/GlobalContext";
import GameCard from "../components/GameCard";
import GameCompareTable from "../components/GameCompareTable";

function debounce(callback, delay) {
  let timer;
  return (...value) => {
    clearTimeout(timer);
    timer = setTimeout(() => callback(...value), delay);
  };
}

const GamesListPage = () => {
  const {
    gamesList,
    fetchGame,
    favoriteGamesList,
    addFavoriteGame,
    removeFavoriteGame,
  } = useGlobalContext();
  const [titleFilter, setTitleFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [alphabeticOrder, setAlphabeticOrder] = useState(1);

  /* Compare first and second game */
  const [firstGame, setFirstGame] = useState({});
  const [secondGame, setSecondGame] = useState({});
  const [firstGameSelection, setFirstGameSelection] = useState("");
  const [secondGameSelection, setSecondGameSelection] = useState("");

  const [compareGamesSelections, setCompareGamesSelections] = useState([
    { value: "", game: {} },
    { value: "", game: {} },
    { value: "", game: {} },
  ]);

  /* Categories for filter by category */
  const categories = useMemo(
    () => gamesList.map((g) => g.category),
    [gamesList]
  );

  /* search by game title */
  const handleSearch = useCallback(
    debounce((e) => {
      setTitleFilter(e.target.value);
    }, 500)
  );

  /* Games sorted */
  const gamesListFiltered = useMemo(
    () =>
      gamesList
        .filter((g) =>
          !categoryFilter
            ? g.title.toLowerCase().includes(titleFilter.toLowerCase())
            : g.title.toLowerCase().includes(titleFilter.toLowerCase()) &&
              g.category === categoryFilter
        )
        .sort((a, b) =>
          alphabeticOrder > 0
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title)
        ),
    [gamesList, titleFilter, categoryFilter, alphabeticOrder]
  );

  /* Compare games  */
  const titlesForCompare = useMemo(
    () =>
      gamesList
        .filter((g) =>
          compareGamesSelections.some((game) => game.value === g.title)
            ? false
            : true
        )
        .map((g) => g.title),
    [gamesList, compareGamesSelections]
  );

  const gamesForCompare = useMemo(() => {
    return compareGamesSelections.map((g) => g.game);
  }, [compareGamesSelections]);

  const handleGameSelectionChange = (index, event) => {
    if (event.target.value) {
      const gameSelected = gamesList.find(
        (game) => game.title === event.target.value
      );

      fetchGame(gameSelected.id)
        .then((data) => {
          setCompareGamesSelections((prevSelections) =>
            prevSelections.map((item, i) =>
              i === index ? { ...item, value: data.title, game: data } : item
            )
          );
        })
        .catch((err) => console.error(err));
    } else
      setCompareGamesSelections((prevSelections) =>
        prevSelections.map((item, i) =>
          i === index ? { ...item, value: "", game: "" } : item
        )
      );
  };

  const getAvailableTitlesForCompare = useCallback(
    (index) => {
      return gamesList
        .map((game) => game.title)
        .filter((title) => {
          if (compareGamesSelections[index].value === title) {
            return true;
          }

          return !compareGamesSelections.some(
            (selection, i) => i !== index && selection.value === title
          );
        });
    },
    [gamesList, compareGamesSelections]
  );

  return (
    <main>
      <section id="filters-section">
        {/* sort by title */}
        <input
          id="search-bar"
          type="text"
          placeholder="Cerca un gioco..."
          onChange={handleSearch}
        />

        {/* sort by category */}
        <select
          id="category-bar"
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">Scegli una categoria...</option>
          {categories.map((c, i) => (
            <option key={i} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* alphabetic sort */}
        <button
          id="alphabetic-sort"
          onClick={() => setAlphabeticOrder((currVal) => currVal * -1)}
        >
          {alphabeticOrder > 0 ? `↑ A...Z` : `↓ Z...A`}
        </button>
      </section>

      {/* games cards */}
      <section id="games-list-section">
        {gamesListFiltered.length > 0 ? (
          gamesListFiltered.map((g) => (
            <div className="card-container" key={g.id}>
              <GameCard game={g} />

              <button
                onClick={() => {
                  if (!favoriteGamesList.some((game) => game.id === g.id))
                    addFavoriteGame(g);
                  else removeFavoriteGame(g.id);
                }}
                className="favorite-game-btn"
              >
                <i
                  className={
                    (favoriteGamesList.some((game) => game.id === g.id)
                      ? "fa-solid"
                      : "fa-regular") + " fa-star fa-xl"
                  }
                ></i>
              </button>
            </div>
          ))
        ) : (
          <p>Nessun gioco è stato trovato...</p>
        )}
      </section>

      <hr />

      {/* Compare games */}
      <h2>Confronta giochi update</h2>
      <section id="compare-section">
        <table>
          <tbody>
            <tr>
              <th></th>
              {compareGamesSelections.map((g, i) => (
                <td key={i}>
                  <select
                    className="title-bar"
                    onChange={(e) => handleGameSelectionChange(i, e)}
                    value={g.value}
                  >
                    <option value="">Seleziona il gioco...</option>
                    {getAvailableTitlesForCompare(i).map((t, i) => (
                      <option key={i} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </td>
              ))}
            </tr>

            <GameCompareTable games={gamesForCompare} />
          </tbody>
        </table>
      </section>
    </main>
  );
};

export default GamesListPage;
