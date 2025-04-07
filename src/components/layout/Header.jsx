import { useState } from "react";
import { createPortal } from "react-dom";
import FavoriteSideBar from "../FavoriteSideBar";

const Header = () => {
  const [showSideBar, setShowSideBar] = useState(false);
  console.log("showSideBars", showSideBar);

  return (
    <header>
      <div id="header-content">
        <h1>
          <i className="fa-solid fa-gamepad"></i>
        </h1>
        <button
          id="favorite-list"
          onClick={() => setShowSideBar((curr) => !curr)}
        >
          Lista dei Preferiti
        </button>

        {createPortal(
          <FavoriteSideBar
            show={showSideBar}
            onClose={() => setShowSideBar((curr) => !curr)}
          />,
          document.body
        )}
      </div>
    </header>
  );
};

export default Header;
