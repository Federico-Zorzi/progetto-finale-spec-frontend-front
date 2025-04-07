import { memo } from "react";
import { Link } from "react-router-dom";

const GameCard = memo(({ game }) => {
  return (
    <div className="card">
      <Link to={`/${game.id}`}>
        <div className="card-header">
          <h3>{game.title}</h3>
        </div>
        <div className="card-body">{game.category}</div>
      </Link>
    </div>
  );
});

export default GameCard;
