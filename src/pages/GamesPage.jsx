import { useMemo, useState } from "react";
import { useGlobalContext } from "../context/GlobalContext";

const GamesPages = () => {
  const { gamesList } = useGlobalContext();
  console.log(gamesList);
  const [titleFilter, setTitleFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  console.log(categoryFilter);

  const category = useMemo(() => gamesList.map((g) => g.category), [gamesList]);

  /* sort games */
  const gamesListFiltered = useMemo(
    () =>
      gamesList.filter((g) =>
        !categoryFilter
          ? g.title.toLowerCase().includes(titleFilter.toLowerCase())
          : g.title.toLowerCase().includes(titleFilter.toLowerCase()) &&
            g.category === categoryFilter
      ),
    [gamesList, titleFilter, categoryFilter]
  );

  return (
    <>
      <header>
        <div id="header-content">
          <h1>Lista giochi</h1>
          <div id="filters-bar">
            {/* sort by title */}
            <input
              id="search-bar"
              type="text"
              placeholder="Cerca un gioco..."
              onChange={(e) => setTitleFilter(e.target.value)}
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
          </div>
        </div>
      </header>

      <main>
        <ul>
          {gamesListFiltered.length > 0 &&
            gamesListFiltered.map((g) => (
              <li key={g.id}>
                {g.title} - <span style={{ color: "red" }}>{g.category}</span>
              </li>
            ))}
        </ul>
      </main>
    </>
  );
};

export default GamesPages;
