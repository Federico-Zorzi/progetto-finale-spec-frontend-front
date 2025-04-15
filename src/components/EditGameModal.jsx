import { useEffect, useMemo, useState } from "react";

import Modal from "./Modal";
import CheckboxGroup from "./CheckboxGroup";

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
const decimalPlaces = 2;

const EditGameModal = ({
  show = false,
  onClose = () => {},
  game = {},
  platforms: initialPlatforms = [],
  gamemodes: initialGamemodes = [],
  onSave = () => {},
}) => {
  const [titleUpdated, setTitleUpdated] = useState(game.title || "");
  const [categoryUpdated, setCategoryUpdated] = useState(game.category || "");
  const [selectedPlatformsUpdated, setSelectedPlatformsUpdated] =
    useState(null);
  const [selectedGameModesUpdated, setSelectedGameModesUpdated] =
    useState(null);
  const [releaseDateUpdated, setReleaseDateUpdated] = useState(
    game.releaseDate || ""
  );
  const [priceUpdated, setPriceUpdated] = useState(game.price || 0);

  /* update initial value */
  useEffect(() => {
    setTitleUpdated(game.title || "");
    setCategoryUpdated(game.category || "");
    setSelectedPlatformsUpdated(initialPlatforms);
    setSelectedGameModesUpdated(initialGamemodes);
    setReleaseDateUpdated(game.releaseDate || "");
    setPriceUpdated(game.price !== undefined ? game.price : 0);
  }, [game, initialPlatforms, initialGamemodes]);

  /* Checkbox group handleChange */
  const handleCheckboxChange = (values, setState) => {
    setState(values);
  };

  /* Input validation */
  const isValidPlatforms = useMemo(
    () => selectedPlatformsUpdated && selectedPlatformsUpdated.length > 0,
    [selectedPlatformsUpdated]
  );

  const isValidGamemodes = useMemo(
    () => selectedGameModesUpdated && selectedGameModesUpdated.length > 0,
    [selectedGameModesUpdated]
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
      setPriceUpdated(newValue);
    }
  };

  /* submit for update a new game */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValidPlatforms || !isValidGamemodes) return;

    const updatedGameData = {
      category: categoryUpdated,
      platforms: selectedPlatformsUpdated,
      gameModes: selectedGameModesUpdated,
      releaseDate: releaseDateUpdated,
      price: parseFloat(priceUpdated) || 0,
    };

    onSave(e, game.id, updatedGameData);
    onClose();
  };

  return (
    <Modal
      title={"Modifica gioco"}
      content={
        <form id="form-modal" onSubmit={handleSubmit}>
          {/* title */}
          <div className="input-container">
            <input id="title" type="text" value={titleUpdated} disabled />
          </div>

          {/* category */}
          <div className="input-container">
            <label htmlFor="category">Categoria: </label>
            <select
              id="category"
              onChange={(e) => setCategoryUpdated(e.target.value)}
              value={categoryUpdated}
              required
            >
              {mainCategories.map((c, i) => (
                <option key={i} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* platform */}
          <div className="input-container">
            {selectedPlatformsUpdated !== null && (
              <CheckboxGroup
                label="Piattaforme:"
                name="platforms"
                options={platforms}
                onChange={handleCheckboxChange}
                defaultValues={selectedPlatformsUpdated}
                setState={setSelectedPlatformsUpdated}
              />
            )}

            {!isValidPlatforms && (
              <p className="input-validation">
                Deve esserci almeno una piattaforma selezionata.
              </p>
            )}
          </div>

          {/* game modes */}
          <div className="input-container">
            {selectedGameModesUpdated !== null && (
              <CheckboxGroup
                label="Modalità di gioco:"
                name="gamemodes"
                options={gameModes}
                onChange={handleCheckboxChange}
                defaultValues={selectedGameModesUpdated}
                setState={setSelectedGameModesUpdated}
              />
            )}

            {!isValidGamemodes && (
              <p className="input-validation">
                Deve esserci almeno una modalità di gioco selezionata.
              </p>
            )}
          </div>

          {/* release date */}
          <div className="input-container">
            <label htmlFor="release-date">Data di rilascio: </label>
            <input
              id="release-date"
              type="date"
              onChange={(e) => setReleaseDateUpdated(e.target.value)}
              value={releaseDateUpdated}
            />
          </div>

          {/* price */}
          <div className="input-container">
            <label htmlFor="release-date">Prezzo €: </label>
            <input
              id="release-date"
              type="number"
              step="any"
              value={priceUpdated}
              onChange={handlePriceChange}
              min={0}
              max={600}
            />
          </div>
        </form>
      }
      show={show}
      onClose={onClose}
      confirmButton={{
        confirmText: "Salva",
        confirmColor: "#6bac57",
        buttonType: "submit",
        buttonForm: "form-modal",
      }}
      disable={!isValidPlatforms || !isValidGamemodes ? "true" : "false"}
    />
  );
};

export default EditGameModal;
