import { memo } from "react";

const GameCard = memo(({ game }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h3>{game.title}</h3>
      </div>
      <div className="card-body">{game.category}</div>
    </div>
  );
});

export default GameCard;
