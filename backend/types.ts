type MainCategory =
  | "Action"
  | "Adventure"
  | "RPG"
  | "Shooter"
  | "Platform"
  | "Sandbox"
  | "Strategy"
  | "Horror"
  | "Sports"
  | "Racing";

type SubCategory =
  | "Open World"
  | "MMORPG"
  | "Roguelike"
  | "Metroidvania"
  | "RTS"
  | "Turn-based"
  | "First-person"
  | "Third-person"
  | "Party"
  | "Puzzle"
  | "Tactical"
  | "Survival"
  | "Battle Royale"
  | "Card Game";

type GameMode =
  | "Singleplayer"
  | "Multiplayer"
  | "Co-op"
  | "Online"
  | "Split-screen"
  | "Drop-in/Drop-out"
  | "Asynchronous"
  | "Cross-platform";

type Platform = "PC" | "PlayStation" | "Xbox" | "Nintendo Switch" | "Mobile";

type SoftwareHouse = {
  name: string;
  country?: string;
  foundedYear?: number;
  parentCompany?: string;
  studios?: string[];
  website?: string;
};

type SystemRequirements = {
  minimum: {
    os: string;
    processor: string;
    memory: string;
    graphics: string;
    storage: string;
  };
  recommended?: {
    os: string;
    processor: string;
    memory: string;
    graphics: string;
    storage: string;
  };
};

type Rating = {
  score: number;
  source: "Metacritic" | "IGN" | "GameSpot" | "Steam" | "User";
};

type DLC = {
  title: string;
  releaseDate: string;
  price: number;
  description: string;
};

export type Videogame = {
  readonly title: string;
  readonly originalTitle?: string;

  readonly subCategories?: SubCategory[];
  readonly softwareHouse: SoftwareHouse;
  readonly publisher?: string;
  readonly engine?: string;

  category: MainCategory;
  platforms: [Platform, ...Platform[]];
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
