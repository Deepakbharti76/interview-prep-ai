const BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : "http://localhost:5000/api";

export const API_PATHS = {
  AUTH: {
    LOGIN: `${BASE_URL}/auth/login`,
    SIGNUP: `${BASE_URL}/auth/signup`,
  },
  SESSION: {
    CREATE: `${BASE_URL}/sessions/create`,
    GET_ALL: `${BASE_URL}/sessions/my-sessions`,
    GET_ONE: `${BASE_URL}/sessions`,
    UPDATE: `${BASE_URL}/sessions`,
    DELETE: `${BASE_URL}/sessions`,
  },
  AI: {
    GENERATE_QUESTIONS: `${BASE_URL}/ai/generate`,
    EXPLAIN: `${BASE_URL}/ai/explain`,
  },
  QUESTIONS: {
    PIN: `${BASE_URL}/questions/pin`,
  },
};
