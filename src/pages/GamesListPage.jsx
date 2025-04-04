import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

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
  const { gamesList, fetchGame } = useGlobalContext();
  /* console.log(gamesList); */
  const [titleFilter, setTitleFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [alphabeticOrder, setAlphabeticOrder] = useState(1);

  /* Compare first and second game */
  const [firstGame, setFirstGame] = useState({});
  const [secondGame, setSecondGame] = useState({});
  const [firstGameSelection, setFirstGameSelection] = useState("");
  const [secondGameSelection, setSecondGameSelection] = useState("");

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

  /* Titles for compare first and second game */
  const titlesForFirstGame = useMemo(
    () =>
      gamesList
        .filter((g) => g.title !== secondGameSelection)
        .map((g) => g.title),
    [gamesList, secondGameSelection]
  );
  const titlesForSecondGame = useMemo(
    () =>
      gamesList
        .filter((g) => g.title !== firstGameSelection)
        .map((g) => g.title),
    [gamesList, firstGameSelection]
  );

  /*  */
  useEffect(() => {
    if (firstGameSelection) {
      const findGame = gamesList.find((g) => g.title === firstGameSelection);
      fetchGame(findGame.id)
        .then((data) => setFirstGame(data))
        .catch((err) => console.error(err));
    } else setFirstGame("");
  }, [gamesList, firstGameSelection]);

  useEffect(() => {
    if (secondGameSelection) {
      const findGame = gamesList.find((g) => g.title === secondGameSelection);
      fetchGame(findGame.id)
        .then((data) => setSecondGame(data))
        .catch((err) => console.error(err));
    } else setSecondGame("");
  }, [gamesList, secondGameSelection]);

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

        <button
          id="alphabetic-sort"
          onClick={() => setAlphabeticOrder((currVal) => currVal * -1)}
        >
          {alphabeticOrder > 0 ? `↑ A...Z` : `↓ Z...A`}
        </button>
      </section>

      <section id="games-list-section">
        {gamesListFiltered.length > 0 &&
          gamesListFiltered.map((g) => (
            <Link key={g.id} to={`/${g.id}`}>
              <GameCard game={g} />
            </Link>
          ))}
      </section>

      <hr />
      <h2>Confronto</h2>
      <section id="compare-section">
        <table>
          <tbody>
            <tr>
              <th></th>
              <td>
                <select
                  className="title-bar"
                  onChange={(e) => setFirstGameSelection(e.target.value)}
                  value={firstGameSelection}
                >
                  <option value="">Seleziona il primo gioco...</option>
                  {titlesForFirstGame.map((t, i) => (
                    <option key={i} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <select
                  className="title-bar"
                  onChange={(e) => setSecondGameSelection(e.target.value)}
                  value={secondGameSelection}
                >
                  <option value="">Seleziona il secondo gioco...</option>
                  {titlesForSecondGame.map((t, i) => (
                    <option key={i} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </td>
            </tr>

            <GameCompareTable games={[firstGame, secondGame]} />
          </tbody>
        </table>
      </section>
    </main>
  );
};

export default GamesListPage;
