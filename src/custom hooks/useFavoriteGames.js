import { useEffect, useReducer, useState } from "react";

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
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    /* Get favorite games list from storage  */
    const favoriteGamesListFromStorage =
      localStorage.getItem("favoriteGamesList");
    try {
      /* Parse data from storage */
      const parsedList = JSON.parse(favoriteGamesListFromStorage);

      /* Load data for reducer */
      dispatch({
        type: "SET_FAVORITE_GAMES",
        payload: Array.isArray(parsedList) ? parsedList : [],
      });
    } catch (error) {
      /* Load data for reducer if something goes wrong */
      dispatch({ type: "SET_FAVORITE_GAMES", payload: [] });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    /* Change data in storage only if we are not in loading condition */
    if (!isLoading) {
      localStorage.setItem(
        "favoriteGamesList",
        JSON.stringify(favoriteGamesList)
      );
    }
  }, [favoriteGamesList, isLoading]);

  const addFavoriteGame = (newFavoriteGame) => {
    dispatch({ type: "ADD_FAVORITE_GAME", payload: { newFavoriteGame } });
  };

  const removeFavoriteGame = (id) => {
    dispatch({ type: "REMOVE_FAVORITE_GAME", payload: { id } });
  };

  return { favoriteGamesList, addFavoriteGame, removeFavoriteGame };
};

export default useFavoriteGames;
