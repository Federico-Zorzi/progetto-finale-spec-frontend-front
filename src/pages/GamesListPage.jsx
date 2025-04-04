import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useGlobalContext } from "../context/GlobalContext";
import GameCard from "../components/GameCard";

function debounce(callback, delay) {
  let timer;
  return (...value) => {
    clearTimeout(timer);
    timer = setTimeout(() => callback(...value), delay);
  };
}

const GamesListPage = () => {
  const { gamesList } = useGlobalContext();
  /* console.log(gamesList); */
  const [titleFilter, setTitleFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [alphabeticOrder, setAlphabeticOrder] = useState(1);

  const category = useMemo(() => gamesList.map((g) => g.category), [gamesList]);

  /* sort games */
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

  /* search by game title */
  const handleSearch = useCallback(
    debounce((e) => {
      setTitleFilter(e.target.value);
    }, 500)
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
          {category.map((c, i) => (
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
    </main>
  );
};

export default GamesListPage;
