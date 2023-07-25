import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '38328018-adf92d25e5f0a3816743083dd';

axios.defaults.baseURL = BASE_URL;
axios.defaults.headers.post['Content-Type'] = 'application/json';

const params = {
  key: API_KEY,
  image_type: 'photo',
  orientation: 'horizontal',
  per_page: 40,
  safesearch: true,
};

export default class AxiosApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchImages() {
    const url = `?q=${this.searchQuery}&page=${this.page}`;
    const response = await axios.get(url, { params });
    this.incrementPage();
    return response.data;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
