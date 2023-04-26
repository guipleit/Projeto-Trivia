export const fetchToken = async () => {
  const RESPONSE = await fetch('https://opentdb.com/api_token.php?command=request');
  const { token } = await RESPONSE.json();
  return token;
};

export const fetchQuestions = async (token, settings) => {
  const { category, difficulty, type, questionAmount } = settings;

  let API_URL = `https://opentdb.com/api.php?amount=${questionAmount}&token=${token}`;

  if (category !== 'Any') {
    API_URL += `&category=${category}`;
  }

  if (difficulty !== 'Any') {
    API_URL += `&difficulty=${difficulty.toLowerCase()}`;
  }

  if (type !== 'Any') {
    API_URL += `&type=${type.toLowerCase()}`;
  }

  const response = await fetch(API_URL);
  const results = await response.json();
  return results;
};
