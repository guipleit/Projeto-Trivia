import { EMAIL, NAME, TOKEN, SCORE, RESET, SETTINGS, TIMER } from '../actions';

const INITIAL_STATE = {
  email: '',
  name: '',
  token: null, // add 20abr
  score: 0,
  assertions: 0,
  incorrectAnswers: 0,
  settings: {
    category: 'Any',
    difficulty: 'Any',
    type: 'Any',
    questionAmount: 5,
    timerValue: 30,
  },
};

function userReducer(state = INITIAL_STATE, action) {
  const { payload, type } = action;
  switch (type) {
  case EMAIL:
    return {
      ...state,
      email: payload,
    };
  case NAME:
    return {
      ...state,
      name: payload,
    };
  case TOKEN:
    return {
      ...state,
      token: payload,
    };
  case SCORE: {
    const { points, isCorrect } = payload;
    return {
      ...state,
      score: state.score + points,
      assertions: isCorrect ? state.assertions + 1 : state.assertions,
      incorrectAnswers: !isCorrect ? state.incorrectAnswers + 1 : state.incorrectAnswers,
    };
  }
  case RESET:
    return INITIAL_STATE;

  case SETTINGS:
    return {
      ...state,
      settings: {
        ...state.settings,
        ...payload,
      },
    };

  case TIMER:
    return {
      ...state,
      settings: {
        ...state.settings,
        timerValue: action.payload,
      },
    };

  default:
    return state;
  }
}

export default userReducer;
