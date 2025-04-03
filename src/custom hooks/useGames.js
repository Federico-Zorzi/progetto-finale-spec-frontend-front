import { useEffect, useReducer } from "react";

function reducerGames(gamesList, action) {
  switch (action.type) {
    case "SET_GAMES":
      return action.payload;

    default:
      return gamesList;
  }
}

const useGames = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [gamesList, dispatch] = useReducer(reducerGames, []);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const resGames = await fetch(`${apiUrl}/videogames`);

        if (!resGames.ok)
          throw new Error(
            `Errore HTTP ${resGames.status} nel recupero dei giochi`
          );

        const games = await resGames.json();
        dispatch({ type: "SET_GAMES", payload: games });
      } catch (error) {
        console.error(error);
      }
    };
    fetchGames();
  }, []);

  return { gamesList };
};

export default useGames;
