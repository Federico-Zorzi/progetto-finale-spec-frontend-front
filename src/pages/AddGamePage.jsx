import dayjs from "dayjs";
import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context/GlobalContext";
import CheckboxGroup from "../components/CheckboxGroup";

/* options for select and checkbox group */
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

/* initial value for checkbox */
const initialPlatforms = ["PC"];
const initialGameModes = ["Singleplayer"];

const AddGamePage = () => {
  const navigate = useNavigate();
  const { gamesList, addGame } = useGlobalContext();

  /* input values from form */
  const [title, setTitle] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState(["PC"]);
  const [selectedGameModes, setSelectedGameModes] = useState(["Singleplayer"]);

  const category = useRef();
  const softwarehouseName = useRef();
  const releaseDate = useRef();
  const price = useRef();

  const [errorMsg, setErrorMsg] = useState("");

  /* chackbox group handleChange */
  const handleChange = (name, values, setState) => {
    setState(values);
  };

  /* submit for add a new game */
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");
    const currDate = new Date();
    const currDateFormatted = dayjs(currDate).format("YYYY-MM-DD");

    if (!isValidTitle || !isValidPlatforms || !isValidGamemodes) return;

    addGame(
      title,
      category.current.value,
      softwarehouseName.current.value,
      selectedPlatforms,
      selectedGameModes,
      releaseDate.current.value || currDateFormatted,
      parseFloat(price.current.value) || 0
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

  /* Input validation */
  const isValidTitle = useMemo(() => {
    const symbols = "!@#$%^&*()-_=+[]{}|;:'\\\",.<>?/`~";
    return (
      !title.split("").some((t) => symbols.includes(t)) &&
      title.trim().length > 0 &&
      !gamesList.some((g) => g.title.toLowerCase() === title.toLowerCase())
    );
  }, [title]);

  const isValidPlatforms = useMemo(
    () => selectedPlatforms.length > 0,
    [selectedPlatforms]
  );

  const isValidGamemodes = useMemo(
    () => selectedGameModes.length > 0,
    [selectedGameModes]
  );

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
            <input
              id="title"
              type="text"
              onChange={(e) => setTitle(e.target.value)}
            />
            {title && !isValidTitle && (
              <p className="input-validation">
                Il titolo non può essere vuoto, non può contenere caratteri
                speciali e non può avere lo stesso nome di un altro gioco
                presente nella lista.
              </p>
            )}
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
              defaultValues={initialPlatforms}
              setState={setSelectedPlatforms}
            />

            {!isValidPlatforms && (
              <p className="input-validation">
                Deve esserci almeno una piattaforma selezionata.
              </p>
            )}
          </div>

          {/* game modes */}
          <div className="input-container">
            <CheckboxGroup
              label="Modalità di gioco:"
              name="gamemodes"
              options={gameModes}
              onChange={handleChange}
              defaultValues={initialGameModes}
              setState={setSelectedGameModes}
            />

            {!isValidGamemodes && (
              <p className="input-validation">
                Deve esserci almeno una modalità di gioco selezionata.
              </p>
            )}
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

          {/* release date */}
          <div className="input-container">
            <label htmlFor="release-date">* Data di rilascio: </label>
            <input
              id="release-date"
              type="date"
              ref={releaseDate}
              min={0}
              max={999}
            />
          </div>

          {/* price */}
          <div className="input-container">
            <label htmlFor="release-date">* Prezzo €: </label>
            <input id="release-date" type="number" step="any" ref={price} />
          </div>

          {/* form info  */}
          <div id="info">
            <p>I campi con * sono opzionali</p>
          </div>

          {/* button for submit */}
          <button
            type="submit"
            disabled={!isValidTitle || !isValidPlatforms || !isValidGamemodes}
          >
            Aggiungi
          </button>
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
