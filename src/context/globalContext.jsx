import { createContext, useContext } from "react";
import useGames from "../custom hooks/useGames";
import useFavoriteGames from "../custom hooks/useFavoriteGames";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalContextProvider = ({ children }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { gamesList, addGame, removeGame, updateGame } = useGames();
  const { favoriteGamesList, addFavoriteGame, removeFavoriteGame } =
    useFavoriteGames();

  const fetchGame = async (id) => {
    try {
      const resGame = await fetch(`${apiUrl}/videogames/${id}`);

      if (!resGame.ok)
        throw new Error(`Errore HTTP ${resGame.status} nel recupero del gioco`);

      const game = await resGame.json();

      if (!game.success)
        throw new Error("Non è stato possibile trovare il gioco");

      return game.videogame;
    } catch (error) {
      console.error(error);
    }
  };

  const globalData = {
    gamesList,
    fetchGame,
    addGame,
    removeGame,
    updateGame,

    favoriteGamesList,
    addFavoriteGame,
    removeFavoriteGame,
  };

  return (
    <GlobalContext.Provider value={globalData}>
      {children}
    </GlobalContext.Provider>
  );
};
