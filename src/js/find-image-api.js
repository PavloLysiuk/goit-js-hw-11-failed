import axios from 'axios';

export async function getGallery() {
  const BASE_URL = 'https://pixabay.com/api/';
  const API_KEY = '38328018-adf92d25e5f0a3816743083dd';
  axios.defaults.baseURL = BASE_URL;

  const options = {
    url: BASE_URL,
    method: 'GET',
    params: {
      key: API_KEY,
      q: `${this.searchQuery}`,
    },
  };
}
