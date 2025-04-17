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

  const [compareSelection, setCompareSelection] = useState(["", ""]);
  const [isSuggestionVisible, setIsSuggestionVisible] = useState([
    false,
    false,
  ]);
  const [compareGamesSelections, setCompareGamesSelections] = useState([
    { value: "", game: {} },
    { value: "", game: {} },
  ]);

  /* Categories for filter */
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

  /* COMPARE GAMES */
  /* Titles available for selection */
  const titlesAvailable = useMemo(
    () =>
      compareSelection.map((s) =>
        gamesList.filter(
          (g) =>
            !compareGamesSelections.some((game) => game.value === g.title) &&
            g.title.toLocaleLowerCase().includes(s.toLocaleLowerCase())
        )
      ),
    [compareSelection, compareGamesSelections]
  );

  /* Game compare selection management */
  const handleGameSelectionChange = (title, index) => {
    const gameSelected = gamesList.find((game) => game.title === title);

    /* Modification of selections */
    setCompareSelection((currVal) =>
      currVal.map((v, i) => (i === index ? title : v))
    );
    /* Changing the visibility of suggestions */
    setIsSuggestionVisible((currVal) => currVal.map((v, i) => false));

    /* Fetch game selected for its data */
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

  /* Number of games for create table */
  const gamesForCompare = useMemo(
    () => compareGamesSelections.map((g) => g.game),
    [compareGamesSelections]
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

        {/* cards of games */}
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
            setCompareSelection((curr) => [...curr, ""]);
            setIsSuggestionVisible((curr) => [...curr, false]);
          }}
          disabled={compareGamesSelections.length >= 5}
        >
          <i className="fa-solid fa-square-plus fa-2xl"></i>
        </button>
      </div>
      <section id="compare-section">
        <table id="compare-table">
          <tbody>
            <tr>
              <th></th>
              {compareSelection.map((input, index) => (
                <td key={index} className="selection-game-cell">
                  <div className="select-game">
                    {index > 1 && (
                      /* Delete compare column button */
                      <button
                        className="compare-trash-btn"
                        onClick={() => {
                          setCompareGamesSelections((curr) =>
                            curr.filter((s, i) => index !== i)
                          );
                          setCompareSelection((curr) =>
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
                    {/* input for games compare */}
                    <input
                      type="text"
                      className={
                        "input-compare " +
                        (index > 1 ? "field-compare-with-delete" : "")
                      }
                      placeholder="Cerca un gioco..."
                      value={compareSelection[index]}
                      onFocus={() =>
                        /* set visibility of suggestions */
                        setIsSuggestionVisible((curr) =>
                          curr.map((v, i) => i === index)
                        )
                      }
                      onChange={(e) => {
                        /* set value for each input */
                        setCompareSelection((currVal) =>
                          currVal.map((v, i) =>
                            i === index ? e.target.value : v
                          )
                        );
                      }}
                      maxLength={50}
                    />

                    {/* Suggestions list under input field */}
                    {compareSelection[index].length > 0 &&
                      isSuggestionVisible[index] && (
                        <div className="suggestions-list">
                          <ul>
                            {titlesAvailable[index].map((g, i) => (
                              <li key={i}>
                                <button
                                  onClick={(e) =>
                                    handleGameSelectionChange(g.title, index)
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

            {/* Table creation for compare  */}
            <GameCompareTable games={gamesForCompare} />
          </tbody>
        </table>
      </section>
    </main>
  );
};

export default GamesListPage;
