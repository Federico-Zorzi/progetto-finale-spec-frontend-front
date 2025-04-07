import { useEffect, useReducer } from "react";

function reducerFavoriteGames(favoriteGamesList, action) {
  switch (action.type) {
    case "SET_FAVORITE_GAMES":
      return action.payload;

    case "ADD_FAVORITE_GAME":
      return [...favoriteGamesList, action.payload.newFavoriteGame];

    case "REMOVE_FAVORITE_GAME":
      return favoriteGamesList.filter((g) => g.id !== action.payload.id);

    default:
      return favoriteGamesList;
  }
}

const useFavoriteGames = () => {
  const [favoriteGamesList, dispatch] = useReducer(reducerFavoriteGames, []);

  useEffect(() => {
    dispatch({ type: "SET_FAVORITE_GAMES", payload: [] });
  }, []);

  const addFavoriteGame = (newFavoriteGame) => {
    dispatch({ type: "ADD_FAVORITE_GAME", payload: { newFavoriteGame } });
  };

  const removeFavoriteGame = (id) => {
    dispatch({ type: "REMOVE_FAVORITE_GAME", payload: { id } });
  };

  return { favoriteGamesList, addFavoriteGame, removeFavoriteGame };
};

export default useFavoriteGames;
