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

/* constant variables */
const decimalPlaces = 2;
const minPrice = 0;
const maxPrice = 600;

const AddGamePage = () => {
  const navigate = useNavigate();
  const { gamesList, addGame } = useGlobalContext();

  /* input values from form */
  const [title, setTitle] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState(["PC"]);
  const [selectedGameModes, setSelectedGameModes] = useState(["Singleplayer"]);
  const [price, setPrice] = useState(0);
  const [softwarehouseName, setSoftwarehouseName] = useState("");

  const category = useRef();
  const releaseDate = useRef();

  const [errorMsg, setErrorMsg] = useState("");

  /* handleChange checkbox group */
  const handleCheckboxChange = (values, setState) => {
    setState(values);
  };

  /* submit for add a new game */
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");
    const currDate = new Date();
    const currDateFormatted = dayjs(currDate).format("YYYY-MM-DD");

    /* validation input fields */
    if (
      !isValidTitle ||
      !isValidSoftwareHouse ||
      !isValidPlatforms ||
      !isValidGamemodes
    )
      return;

    /* add game function */
    addGame(
      title,
      category.current.value,
      softwarehouseName,
      selectedPlatforms,
      selectedGameModes,
      releaseDate.current.value || currDateFormatted,
      parseFloat(price) || 0
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

  const isValidSoftwareHouse = useMemo(() => {
    const symbols = "!@#$%^&*()-_=+[]{}|;:'\\\",.<>?/`~";
    return (
      !softwarehouseName.split("").some((n) => symbols.includes(n)) &&
      softwarehouseName.trim().length > 0
    );
  }, [softwarehouseName]);

  const isValidPlatforms = useMemo(
    () => selectedPlatforms.length > 0,
    [selectedPlatforms]
  );

  const isValidGamemodes = useMemo(
    () => selectedGameModes.length > 0,
    [selectedGameModes]
  );

  const isValidPrice = useMemo(
    () => price >= minPrice && price <= maxPrice,
    [price]
  );

  /* handlePriceChange for validation price */
  const handlePriceChange = (e) => {
    const newValue = e.target.value;
    /* REGEX
      (^\\d*) start from 0.
      {0,3} numbers limit before , 
      (\\.) optional point for decimals
      \\d{0,${decimalPlaces}})? check max num for decimals
    */
    const regex = new RegExp(`^\\d{0,3}(\\.\\d{0,${decimalPlaces}})?$`);

    /* checks whether the value is empty or respects the regex  */
    if (newValue === "" || regex.test(newValue)) {
      setPrice(newValue);
    }
  };

  return (
    <main>
      <section id="add-game-section">
        <button id="back-btn" onClick={() => navigate(`/`)}>
          ← Indietro
        </button>

        {/* form for add new game */}
        <form onSubmit={handleSubmit}>
          {/* title */}
          <div className="input-container">
            <label htmlFor="title">* Titolo: </label>
            <input
              id="title"
              type="text"
              onChange={(e) => setTitle(e.target.value)}
              maxLength={50}
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
            <label htmlFor="category">* Categoria: </label>
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
              label="* Piattaforme:"
              name="platforms"
              options={platforms}
              onChange={handleCheckboxChange}
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
              label="* Modalità di gioco:"
              name="gamemodes"
              options={gameModes}
              onChange={handleCheckboxChange}
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
            <label htmlFor="softwarehouse-name">* Casa di sviluppo: </label>
            <input
              id="softwarehouse-name"
              type="text"
              value={softwarehouseName}
              onChange={(e) => setSoftwarehouseName(e.target.value)}
              maxLength={50}
            />

            {softwarehouseName && !isValidSoftwareHouse && (
              <p className="input-validation">
                Il nome della casa di sviluppo non può essere vuoto, non può
                contenere caratteri speciali e non può avere lo stesso nome di
                un altro gioco presente nella lista.
              </p>
            )}
          </div>

          {/* release date */}
          <div className="input-container">
            <label htmlFor="release-date">Data di rilascio: </label>
            <input id="release-date" type="date" ref={releaseDate} />
          </div>

          {/* price */}
          <div className="input-container">
            <label htmlFor="release-date">Prezzo €: </label>
            <input
              id="release-date"
              type="number"
              step="any"
              value={price}
              onChange={handlePriceChange}
              min={minPrice}
              max={maxPrice}
            />
            {!isValidPrice && (
              <p className="input-validation">
                {`Il prezzo del gioco non può essere inferiore a ${minPrice}€ o maggiore di ${maxPrice}€`}
              </p>
            )}
          </div>

          {/* form info */}
          <div id="info">
            <p>I campi con * sono obbligatori</p>
          </div>

          {/* button for submit */}
          <button
            type="submit"
            disabled={
              !isValidTitle ||
              !isValidSoftwareHouse ||
              !isValidPlatforms ||
              !isValidGamemodes
            }
          >
            Aggiungi
          </button>
        </form>

        {/* alert for error message */}
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
