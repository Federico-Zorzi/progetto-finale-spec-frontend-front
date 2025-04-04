import { memo } from "react";

const GameCompareTable = memo(({ games }) => {
  const game1 = games[0];
  const game2 = games[1];

  return (
    <>
      <tr>
        <th>Data di rilascio:</th>
        <td>{game1?.releaseDate || "-"}</td>
        <td>{game2?.releaseDate || "-"}</td>
      </tr>
      <tr>
        <th>Casa di produzione:</th>
        <td>{game1?.softwareHouse?.name || "-"}</td>
        <td>{game2?.softwareHouse?.name || "-"}</td>
      </tr>
      <tr>
        <th>Prezzo:</th>
        <td>{game1?.price ? `${game1.price}€` : "-"}</td>
        <td>{game2?.price ? `${game2.price}€` : "-"}</td>
      </tr>
      <tr>
        <th>Piattaforme:</th>
        <td>{game1?.platforms?.join(", ") || "-"}</td>
        <td>{game2?.platforms?.join(", ") || "-"}</td>
      </tr>
      <tr>
        <th>Modalità di gioco:</th>
        <td>{game1?.gameModes?.join(", ") || "-"}</td>
        <td>{game2?.gameModes?.join(", ") || "-"}</td>
      </tr>
    </>
  );
});

export default GameCompareTable;
