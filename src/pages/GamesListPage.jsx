import { useCallback, useEffect, useMemo, useState } from "react";

import { useGlobalContext } from "../context/GlobalContext";
import GameCard from "../components/GameCard";
import GameCompareTable from "../components/GameCompareTable";
import { Link } from "react-router-dom";

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

  const [searchSelection, setSearchSelection] = useState(["", ""]);
  const [isSuggestionVisible, setIsSuggestionVisible] = useState([
    false,
    false,
  ]);
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
              return a.category.localeCompare(b.category) !== 0
                ? a.category.localeCompare(b.category)
                : a.title.localeCompare(b.title);

            case "category_desc":
              return b.category.localeCompare(a.category) !== 0
                ? b.category.localeCompare(a.category)
                : b.title.localeCompare(a.title);

            default:
              return a.title.localeCompare(b.title);
          }
        }),
    [gamesList, titleFilter, categoryFilter, alphabeticOrder]
  );

  /* COMPARE GAMES  */
  /* Title available for selection */
  const titlesAvailable = useMemo(() => {
    return searchSelection.map((s) =>
      gamesList.filter(
        (g) =>
          !compareGamesSelections.some((game) => game.value === g.title) &&
          g.title.toLocaleLowerCase().includes(s.toLocaleLowerCase())
      )
    );
  }, [searchSelection, compareGamesSelections]);

  /* Game selection management */
  const handleGameSelectionChange = (title, index, event) => {
    const gameSelected = gamesList.find((game) => game.title === title);
    setSearchSelection((currVal) =>
      currVal.map((v, i) => (i === index ? title : v))
    );
    setIsSuggestionVisible((currVal) => currVal.map((v, i) => false));

    fetchGame(gameSelected.id)
      .then((data) => {
        setCompareGamesSelections((prevSelections) =>
          prevSelections.map((item, i) =>
            i === index ? { ...item, value: data.title, game: data } : item
          )
        );
      })
      .catch((err) => console.error(err));
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
          maxLength={50}
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

      <div id="number-results">
        Risultati trovati: {gamesListFiltered.length}
      </div>

      {/* games cards */}
      <section id="games-list-section">
        {/* card add game */}
        <div className="card card-add-game">
          <Link to={`/addGame`}>
            <div className="card-header-add-game">
              <span>+</span>
            </div>
          </Link>
        </div>

        {gamesListFiltered.length > 0 &&
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
          ))}
      </section>

      <hr />

      {/* Compare games */}
      <div id="compare-games-header">
        <h2>Confronta giochi</h2>
        <button
          id="add-compare-game-btn"
          onClick={() => {
            setCompareGamesSelections((curr) => [
              ...curr,
              { value: "", game: {} },
            ]);
            setSearchSelection((curr) => [...curr, ""]);
            setIsSuggestionVisible((curr) => [...curr, false]);
          }}
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
              {searchSelection.map((input, index) => (
                <td key={index} className="selection-game-cell">
                  <div className="select-game">
                    {index > 1 && (
                      <button
                        className="compare-trash-btn"
                        onClick={() => {
                          setCompareGamesSelections((curr) =>
                            curr.filter((s, i) => index !== i)
                          );
                          setSearchSelection((curr) =>
                            curr.filter((s, i) => index !== i)
                          );
                          setIsSuggestionVisible((curr) =>
                            curr.filter((s, i) => index !== i)
                          );
                        }}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    )}
                    <input
                      type="text"
                      className={
                        "input-compare " +
                        (index > 1 ? "fied-compare-with-delete" : "")
                      }
                      placeholder="Cerca un gioco..."
                      value={searchSelection[index]}
                      onFocus={() =>
                        setIsSuggestionVisible((curr) =>
                          curr.map((v, i) => i === index)
                        )
                      }
                      onChange={(e) => {
                        setSearchSelection((currVal) =>
                          currVal.map((v, i) =>
                            i === index ? e.target.value : v
                          )
                        );
                      }}
                      maxLength={50}
                    />
                    {searchSelection[index].length > 0 &&
                      isSuggestionVisible[index] && (
                        <div className="suggestions-list">
                          <ul>
                            {titlesAvailable[index].map((g, i) => (
                              <li key={i}>
                                <button
                                  onClick={(e) =>
                                    handleGameSelectionChange(g.title, index, e)
                                  }
                                >
                                  {g.title}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
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
