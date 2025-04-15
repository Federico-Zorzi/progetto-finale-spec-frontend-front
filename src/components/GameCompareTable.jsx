import dayjs from "dayjs";
import { memo } from "react";

const GameCompareTable = memo(({ games }) => {
  return (
    <>
      {/* titles */}
      <tr className="compare-row">
        <th className="header-cell">Titolo:</th>
        {games.map((g, i) => (
          <td key={i} className="compare-cell">
            {g.title ?? "-"}
          </td>
        ))}
      </tr>

      {/* release date */}
      <tr className="compare-row">
        <th className="header-cell">Data di rilascio:</th>
        {games.map((g, i) => (
          <td key={i} className="compare-cell">
            {g.releaseDate ? dayjs(g?.releaseDate).format("DD/MM/YYYY") : "-"}
          </td>
        ))}
      </tr>

      {/* softwarehouse */}
      <tr className="compare-row">
        <th className="header-cell">Casa di produzione:</th>
        {games.map((g, i) => (
          <td key={i} className="compare-cell">
            {g?.softwareHouse?.name || "-"}
          </td>
        ))}
      </tr>

      {/* price */}
      <tr className="compare-row">
        <th className="header-cell">Prezzo:</th>
        {games.map((g, i) => (
          <td key={i} className="compare-cell">
            {Object.keys(g).length === 0
              ? "-"
              : g.price
              ? `${g.price}€`
              : "Gratis"}
          </td>
        ))}
      </tr>

      {/* platforms */}
      <tr className="compare-row">
        <th className="header-cell">Piattaforme:</th>
        {games.map((g, i) => (
          <td key={i} className="compare-cell">
            {g?.platforms?.join(", ") || "-"}
          </td>
        ))}
      </tr>

      {/* gamemodes */}
      <tr className="compare-row">
        <th className="header-cell">Modalità di gioco:</th>
        {games.map((g, i) => (
          <td key={i} className="compare-cell">
            {g?.gameModes?.join(", ") || "-"}
          </td>
        ))}
      </tr>
    </>
  );
});

export default GameCompareTable;
