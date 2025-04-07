import { memo } from "react";

const GameCompareTable = memo(({ games }) => {
  return (
    <>
      <tr>
        <th>Data di rilascio:</th>
        {games.map((g, i) => (
          <td key={i}>{g?.releaseDate || "-"}</td>
        ))}
      </tr>
      <tr>
        <th>Casa di produzione:</th>
        {games.map((g, i) => (
          <td key={i}>{g?.softwareHouse?.name || "-"}</td>
        ))}
      </tr>
      <tr>
        <th>Prezzo:</th>
        {games.map((g, i) => (
          <td key={i}>{g?.price ? `${g.price}€` : "-"}</td>
        ))}
      </tr>
      <tr>
        <th>Piattaforme:</th>
        {games.map((g, i) => (
          <td key={i}>{g?.platforms?.join(", ") || "-"}</td>
        ))}
      </tr>
      <tr>
        <th>Modalità di gioco:</th>
        {games.map((g, i) => (
          <td key={i}>{g?.gameModes?.join(", ") || "-"}</td>
        ))}
      </tr>
    </>
  );
});

export default GameCompareTable;
