import { useState } from "react";
import { createPortal } from "react-dom";
import FavoriteSideBar from "../FavoriteSideBar";
import { Link } from "react-router-dom";

const Header = () => {
  const [showSideBar, setShowSideBar] = useState(false);
  console.log("showSideBars", showSideBar);

  return (
    <header>
      <div id="header-content">
        <Link to={"/"}>
          <i className="fa-solid fa-gamepad fa-2xl"></i>
        </Link>
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
