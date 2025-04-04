import { createContext, useContext } from "react";
import useGames from "../custom hooks/useGames";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalContextProvider = ({ children }) => {
  const { gamesList } = useGames();

  const globalData = {
    gamesList,
  };

  return (
    <GlobalContext.Provider value={globalData}>
      {children}
    </GlobalContext.Provider>
  );
};
