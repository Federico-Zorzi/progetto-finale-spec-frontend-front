import { useEffect, useReducer } from "react";

function reducerGames(gamesList, action) {
  switch (action.type) {
    case "SET_GAMES":
      return action.payload;

    case "ADD_GAME":
      return [...gamesList, action.payload];

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
        return error;
      }
    };
    fetchGames();
  }, []);

  const addGame = async (
    title,
    category,
    softwarehouseName,
    platforms,
    gameModes,
    releaseDate,
    price
  ) => {
    try {
      const resFetchGame = await fetch(`${apiUrl}/videogames`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          platforms,
          gameModes,
          softwareHouse: { name: softwarehouseName },
          price,
          releaseDate,
        }),
      });

      if (!resFetchGame.ok)
        throw new Error(
          `Errore HTTP ${resFetchGame.status} nell'aggiunta del nuovo gioco`
        );

      const resGame = await resFetchGame.json();

      if (!resGame.success || resGame.error) {
        let errorMessage = resGame.error || "Errore sconosciuto dal server.";

        if (
          resGame.details &&
          Array.isArray(resGame.details) &&
          resGame.details.length > 0
        ) {
          const detailsMessages = resGame.details
            .map((d) => `${d.field} - ${d.message}`)
            .join("\n");

          errorMessage += `\nDettagli:\n${detailsMessages}`;
          console.log("errorMessage", errorMessage);
        }
        throw new Error(errorMessage);
      }

      dispatch({ type: "ADD_GAME", payload: resGame.videogame });
      return resGame;
    } catch (err) {
      /* 
      {error: 'Invalid videogame data',
      details: 
      0: {field: 'platforms', message: 'Array must contain at least 1 element(s)'}
      1: {field: 'gameModes', message: 'Array must contain at least 1 element(s)'}
      }      */
      throw err;
    }
  };

  return { gamesList, addGame };
};

export default useGames;
