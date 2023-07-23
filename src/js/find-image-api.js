import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '38328018-adf92d25e5f0a3816743083dd';

axios.defaults.baseURL = BASE_URL;

export async function getGallery(searchQuery, page = 1) {
  const options = {
    url: BASE_URL,
    method: 'GET',
    params: {
      key: API_KEY,
      q: searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      per_page: 40,
      page: page,
    },
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return await axios.get('', options);
}
