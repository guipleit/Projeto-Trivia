// actions
export const EMAIL = 'email';
export const NAME = 'name';
export const TOKEN = 'token';
export const QUESTIONS = 'questions';
export const SCORE = 'score';
export const RESET = 'reset';
export const RANKING = 'ranking';
export const SETTINGS = 'settings';
export const TIMER = 'timer';

export const emailLogin = (payload) => ({
  type: EMAIL,
  payload,
});

export const nameLogin = (payload) => ({
  type: NAME,
  payload,
});

export const tokenLogin = (payload) => ({
  type: TOKEN,
  payload,
});

export const updateScore = (payload) => ({
  type: SCORE,
  payload,
});

export const fetchQuestions = (payload) => ({
  type: QUESTIONS,
  payload,
});

export const updateRanking = (payload) => ({
  type: RANKING,
  payload,
});

export const resetState = () => ({
  type: RESET,
});

export const updateSettings = (payload) => ({
  type: SETTINGS,
  payload,
});

export const updateTimer = (payload) => ({
  type: TIMER,
  payload,
});
