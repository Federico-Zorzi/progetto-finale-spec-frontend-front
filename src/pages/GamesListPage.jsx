import { useCallback, useMemo, useState } from "react";

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
  const [alphabeticOrder, setAlphabeticOrder] = useState("title_asc");

  const [compareGamesSelections, setCompareGamesSelections] = useState([
    { value: "", game: {} },
    { value: "", game: {} },
  ]);

  /* Categories for filter by category */
  const categories = useMemo(
    () =>
      gamesList.reduce((acc, curr) => {
        if (!acc.includes(curr.category)) acc.push(curr.category);
        return acc;
      }, []),
    [gamesList]
  );

  /* Search by game title */
  const handleSearch = useCallback(
    debounce((e) => {
      setTitleFilter(e.target.value);
    }, 500)
  );

  /* SORT GAMES */
  const gamesListFiltered = useMemo(
    () =>
      gamesList
        .filter((g) =>
          !categoryFilter
            ? g.title.toLowerCase().includes(titleFilter.toLowerCase())
            : g.title.toLowerCase().includes(titleFilter.toLowerCase()) &&
              g.category === categoryFilter
        )
        .sort((a, b) => {
          switch (alphabeticOrder) {
            case "title_asc":
              return a.title.localeCompare(b.title);

            case "title_desc":
              return b.title.localeCompare(a.title);

            case "category_asc":
              return a.category.localeCompare(b.category);

            case "category_desc":
              return b.category.localeCompare(a.category);

            default:
              return a.title.localeCompare(b.title);
          }
        }),
    [gamesList, titleFilter, categoryFilter, alphabeticOrder]
  );

  /* COMPARE GAMES  */
  /* Title available for selection */
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

  /* Game selection management */
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

  /* Games selected for create table */
  const gamesForCompare = useMemo(() => {
    return compareGamesSelections.map((g) => g.game);
  }, [compareGamesSelections]);

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
        <select
          id="alphabetic-sort"
          onChange={(e) => setAlphabeticOrder(e.target.value)}
        >
          <option value="title_asc">↑ A...Z Titolo</option>
          <option value="title_desc">↓ Z...A Titolo</option>
          <option value="category_asc">↑ A...Z Categoria</option>
          <option value="category_desc">↓ Z...A Categoria</option>
        </select>
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
      <div id="compare-games-header">
        <h2>Confronta giochi</h2>
        <button
          id="add-compare-game-btn"
          onClick={() =>
            gamesList.length !== compareGamesSelections.length &&
            setCompareGamesSelections((curr) => [
              ...curr,
              { value: "", game: {} },
            ])
          }
          disabled={gamesList.length === compareGamesSelections.length}
        >
          <i className="fa-solid fa-square-plus fa-2xl"></i>
        </button>
      </div>
      <section id="compare-section">
        <table id="compare-table">
          <tbody>
            <tr>
              <th></th>
              {compareGamesSelections.map((g, i) => (
                <td key={i} className="selection-game-cell">
                  <div className="select-game">
                    {i > 1 && (
                      <button
                        onClick={() =>
                          setCompareGamesSelections((curr) =>
                            curr.filter((s, index) => index !== i)
                          )
                        }
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    )}
                    <select
                      className={"title-bar" + (i > 1 ? "" : "-default")}
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
                  </div>
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
