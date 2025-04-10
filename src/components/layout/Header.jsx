import { useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import FavoriteSideBar from "../FavoriteSideBar";

const Header = () => {
  const [showSideBar, setShowSideBar] = useState(false);
  const navigate = useNavigate();

  return (
    <header>
      <div id="header-content">
        <Link to={"/"}>
          <i className="fa-solid fa-gamepad fa-2xl"></i>
        </Link>
        <div>
          {/* <button className="header-btns" onClick={() => navigate(`/AddGame`)}>
            Aggiungi giochi
          </button> */}
          <button
            className="header-btns"
            onClick={() => setShowSideBar((curr) => !curr)}
          >
            Lista dei Preferiti
          </button>
        </div>

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
