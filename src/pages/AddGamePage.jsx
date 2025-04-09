import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import CheckboxGroup from "../components/CheckboxGroup";
import { useGlobalContext } from "../context/GlobalContext";

const mainCategories = [
  "Action",
  "Adventure",
  "RPG",
  "Shooter",
  "Platform",
  "Sandbox",
  "Strategy",
  "Horror",
  "Sports",
  "Racing",
];
const platforms = ["PC", "PlayStation", "Xbox", "Nintendo Switch", "Mobile"];
const gameModes = [
  "Singleplayer",
  "Multiplayer",
  "Co-op",
  "Online",
  "Split-screen",
  "Drop-in/Drop-out",
  "Asynchronous",
  "Cross-platform",
];

const AddGamePage = () => {
  const navigate = useNavigate();
  const { addGame } = useGlobalContext();

  /* input values from form */
  const title = useRef();
  const category = useRef();
  const softwarehouseName = useRef();
  const [selectedPlatforms, setSelectedPlatforms] = useState(["PC"]);
  const [selectedGameModes, setSelectedGameModes] = useState(["Singleplayer"]);

  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (name, values, setState) => {
    setState(values);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");

    addGame(
      title.current.value,
      category.current.value,
      softwarehouseName.current.value,
      selectedPlatforms,
      selectedGameModes
    )
      .then((data) => {
        if (data.videogame && data.videogame.title) {
          alert(`Gioco "${data.videogame.title}" aggiunto con successo!`);
        } else alert("Gioco aggiunto con successo!");
        navigate(`/`);
      })
      .catch((error) => {
        setErrorMsg(error.message);
      });
  };

  return (
    <main>
      <section id="add-game-section">
        <button id="back-btn" onClick={() => navigate(`/`)}>
          ← Indietro
        </button>

        <form onSubmit={handleSubmit}>
          {/* title */}
          <div className="input-container">
            <label htmlFor="title">Titolo: </label>
            <input id="title" type="text" ref={title} />
          </div>

          {/* category */}
          <div className="input-container">
            <label htmlFor="category">Categoria: </label>
            <select id="category" ref={category} required>
              <option value="">Seleziona categoria...</option>
              {mainCategories.map((c, i) => (
                <option key={i} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* platform */}
          <div className="input-container">
            <CheckboxGroup
              label="Piattaforme:"
              name="platforms"
              options={platforms}
              onChange={handleChange}
              defaultValues={["PC"]}
              setState={setSelectedPlatforms}
            />
          </div>

          {/* game modes */}
          <div className="input-container">
            <CheckboxGroup
              label="Modalità di gioco:"
              name="gamemodes"
              options={gameModes}
              onChange={handleChange}
              defaultValues={["Singleplayer"]}
              setState={setSelectedGameModes}
            />
          </div>

          {/* softwarehouse name */}
          <div className="input-container">
            <label htmlFor="softwarehouse-name">Casa di sviluppo: </label>
            <input
              id="softwarehouse-name"
              type="text"
              ref={softwarehouseName}
            />
          </div>

          <button type="submit">Invia form</button>
        </form>

        {errorMsg && (
          <div className="error-alert">
            <p>{errorMsg}</p>
          </div>
        )}
      </section>
    </main>
  );
};

export default AddGamePage;

/* 
export type Videogame = {
  readonly title: string;
  readonly originalTitle?: string;
  readonly category: MainCategory;

  readonly subCategories?: SubCategory[];
  readonly platforms: [Platform, ...Platform[]];
  readonly softwareHouse: SoftwareHouse;
  readonly publisher?: string;
  readonly engine?: string;

  gameModes: [GameMode, ...GameMode[]];
  supportedLanguages?: string[];
  ageRating?:
    | "PEGI 3"
    | "PEGI 7"
    | "PEGI 12"
    | "PEGI 16"
    | "PEGI 18"
    | "ESRB E"
    | "ESRB T"
    | "ESRB M";

  releaseDate?: string;
  earlyAccessDate?: string;
  lastUpdate?: string;

  description?: string;
  features?: string[];
  dlcs?: DLC[];

  systemRequirements?: SystemRequirements;

  price?: number;
  discount?: number;
  inGamePurchases?: boolean;
  ratings?: Rating[];
  averageRating?: number;
  averagePlaytime?: string;
  totalSales?: number;

  coverImage?: string;
  screenshots?: string[];
  trailerUrl?: string;
};

  
*/
