import { useEffect, useReducer } from "react";

/* Reducer for games list management */
function reducerGames(gamesList, action) {
  switch (action.type) {
    case "SET_GAMES":
      return action.payload;

    case "ADD_GAME":
      return [...gamesList, action.payload];

    case "REMOVE_GAME":
      return gamesList.filter((g) => g.id !== parseInt(action.payload));

    case "UPDATE_GAME":
      const { gameId, gameUpdated } = action.payload;
      return gamesList.map((g) => (g.id === gameId ? gameUpdated : g));

    default:
      return gamesList;
  }
}

const useGames = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [gamesList, dispatch] = useReducer(reducerGames, []);

  /* Fetch all games at the start */
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
      } catch (err) {
        throw err;
      }
    };
    fetchGames();
  }, []);

  /* Function for add new game */
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

        /* Print a custom error message */
        if (
          resGame.details &&
          Array.isArray(resGame.details) &&
          resGame.details.length > 0
        ) {
          const detailsMessages = resGame.details
            .map((d) => `${d.field} - ${d.message}`)
            .join("\n");

          errorMessage += `\nDettagli:\n${detailsMessages}`;
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

  /* Function for remove game */
  const removeGame = async (gameId) => {
    try {
      const resFetchGame = await fetch(`${apiUrl}/videogames/${gameId}`, {
        method: "DELETE",
      });

      if (!resFetchGame.ok)
        throw new Error(
          `Errore HTTP ${resFetchGame.status} nell'eliminazione del gioco`
        );

      const resGame = await resFetchGame.json();

      if (!resGame.success)
        throw new Error(
          `Non è stato possibile eliminare il gioco con id:${gameId}`
        );

      dispatch({ type: "REMOVE_GAME", payload: gameId });
      return resGame;
    } catch (err) {
      throw err;
    }
  };

  /* Function for update a game */
  const updateGame = async (gameId, gameModified) => {
    try {
      const resFetchGame = await fetch(`${apiUrl}/videogames/${gameId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(gameModified),
      });

      if (!resFetchGame.ok)
        throw new Error(
          `Errore HTTP ${resFetchGame.status} nella modifica del gioco`
        );

      const resGame = await resFetchGame.json();

      if (!resGame.success)
        throw new Error(
          `Non è stato possibile modificare il gioco con id:${gameId}`
        );

      dispatch({
        type: "UPDATE_GAME",
        payload: { gameId, gameUpdated: resGame.videogame },
      });
      return resGame;
    } catch (err) {
      throw err;
    }
  };

  return { gamesList, addGame, removeGame, updateGame };
};

export default useGames;
