import dayjs from "dayjs";
import { memo } from "react";

const GameCompareTable = memo(({ games }) => {
  console.log("game1", games[0]);

  return (
    <>
      <tr className="compare-row">
        <th className="header-cell">Data di rilascio:</th>
        {games.map((g, i) => (
          <td key={i} className="compare-cell">
            {g.releaseDate ? dayjs(g?.releaseDate).format("DD/MM/YYYY") : "-"}
          </td>
        ))}
      </tr>
      <tr className="compare-row">
        <th className="header-cell">Casa di produzione:</th>
        {games.map((g, i) => (
          <td key={i} className="compare-cell">
            {g?.softwareHouse?.name || "-"}
          </td>
        ))}
      </tr>
      <tr className="compare-row">
        <th className="header-cell">Prezzo:</th>
        {games.map((g, i) => (
          <td key={i} className="compare-cell">
            {g?.price ? `${g.price}€` : "-"}
          </td>
        ))}
      </tr>
      <tr className="compare-row">
        <th className="header-cell">Piattaforme:</th>
        {games.map((g, i) => (
          <td key={i} className="compare-cell">
            {g?.platforms?.join(", ") || "-"}
          </td>
        ))}
      </tr>
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
