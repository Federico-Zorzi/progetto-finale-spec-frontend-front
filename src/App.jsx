import { BrowserRouter, Routes, Route } from "react-router-dom";

import DefaultLayout from "./pages/layouts/DefaultLayout";

import GamesListPage from "./pages/GamesListPage";
import GamePage from "./pages/GamePage";

import { GlobalContextProvider } from "./context/GlobalContext";
import AddGamePage from "./pages/AddGamePage";

function App() {
  return (
    <GlobalContextProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<DefaultLayout />}>
            <Route path="/" element={<GamesListPage />}></Route>
            <Route path="/AddGame" element={<AddGamePage />}></Route>
            <Route path="/:id" element={<GamePage />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </GlobalContextProvider>
  );
}

export default App;
