export const DEBUG = true;

export const USER_STATES = {
  MENU: "v menu",
  LOBBY: "v lobby",
  GAME: "v igre",
};

export const ROOM_STATES = {
  LOBBY: "lobby",
  GAME: "game",
  ENDED: "ended",
};

export const GAME_STATES = {
  START: "starting",

  REGION_PICK: "region_pick",
  REGION_ATTACK: "region_attack",
  REGION_BATTLE: "region_battle",
  REGION_RESULTS: "region_results",

  QUESTION_GUESS: "question_guess",
  QUESTION_RESULTS: "question_results",
};

export const GAME_STAGES = {
  TAKE_REGIONS: "take_regions",
  BATTLE_REGIONS: "battle_regions",
};

export const QUESTION_TYPES = {
  PICK: "pick",
  NUMERIC: "numeric",
  IMAGE: "image",
};

export const GAME_REGION_NEIGHBORS = {
  0: [1, 6, 8, 9, 14],
  1: [0, 6, 8, 13, 14],
  2: [3, 4, 5, 7, 13, 14],
  3: [2, 4, 12, 14],
  4: [2, 3, 5, 12, 14],
  5: [2, 4, 7, 8, 11, 14],
  6: [0, 1, 8, 14],
  7: [2, 5, 8, 13],
  8: [0, 1, 5, 6, 7, 9, 10, 11, 13],
  9: [0, 8, 11, 14],
  10: [8],
  11: [5, 8, 9, 14],
  12: [3, 4, 14],
  13: [1, 2, 7, 8, 14],
  14: [0, 1, 2, 3, 4, 5, 6, 9, 11, 12, 13],
};

export const NUMBER_OF_REGIONS = 14;

// ------------ CLIENT DEDICATED ------------

export const PLAYER_COLORS = ["#FF4545", "#52FF68", "#4EBAFF"];

export const PLAYER_COLORS_DARK = ["#7C2828", "#2BA23B", "#226894"];

export const PLAYER_COLORS_LIGHT = ["#941C1C", "#93FFA1", "#84CFFF"];
