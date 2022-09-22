const API_BASE_URL = 'http://localhost:8080/api';
// const API_BASE_URL = 'http://i7a508.p.ssafy.io:5000/api'

// 경로
const USER_URL = '/user';
const HANGUL_URL = '/hangul';

// URI
// User
const SIGNIN_URL = '/signin';

// Hangul
const CONSONANT_URL = '/own/consonant';

const api = {
  // user
  signin: () => API_BASE_URL + USER_URL + SIGNIN_URL,
  fetchUser: (walletAddress: String) => API_BASE_URL + USER_URL + `?wallet-address=${walletAddress}`,

  // hangul
  fetchConsonant: (walletAddress: String) =>
    API_BASE_URL + HANGUL_URL + CONSONANT_URL + `?wallet-address=${walletAddress}`,
};

export default api;
