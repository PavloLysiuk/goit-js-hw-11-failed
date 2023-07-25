// import axios from 'axios';

// const BASE_URL = 'https://pixabay.com/api/';
// const API_KEY = '38328018-adf92d25e5f0a3816743083dd';

// // axios.defaults.baseURL = BASE_URL;
// // axios.defaults.headers.post['Content-Type'] = 'application/json';

// const params = {
//   key: API_KEY,
//   image_type: 'photo',
//   orientation: 'horizontal',
//   per_page: 40,
//   safesearch: true,
// };

// export default class AxiosApiService {
//   constructor() {
//     this.searchQuery = '';
//     this.page = 1;
//   }

//   async fetchImages() {
//     const url = `${BASE_URL}?q=${this.searchQuery}&page=${this.page}`;
//     const response = await axios.get(url, { params });
//     this.incrementPage();
//     return response.data;
//   }

//   incrementPage() {
//     this.page += 1;
//   }

//   resetPage() {
//     this.page = 1;
//   }

//   get query() {
//     return this.searchQuery;
//   }

//   set query(newQuery) {
//     this.searchQuery = newQuery;
//   }
// }

import axios from 'axios';

const params = {
  key: '38328018-adf92d25e5f0a3816743083dd',
  image_type: 'photo',
  orientation: 'horizontal',
  per_page: 16,
  safesearch: true,
};

export default class AxiosApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchImages() {
    try {
      const url = `https://pixabay.com/api/?q=${this.searchQuery}&page=${this.page}`;
      const response = await axios.get(url, { params });

      this.incrementPage();
      return response.data;
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log('Error', error.message);
      }
      console.log(error.config);
    }
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