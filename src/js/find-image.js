// import { getGallery } from './find-image-api';
// import galleryMarkup from './gallery-markup';
// import { lightbox } from './simple-lightbox';
// import { Notify } from 'notiflix/build/notiflix-notify-aio';

// const selectors = {
//   form: document.querySelector('.search-form'),
//   gallery: document.querySelector('.gallery'),
//   loadMoreGuard: document.querySelector('.js-guard'),
// };

// selectors.form.addEventListener('submit', onSearchClick);

// const options = {
//   root: null,
//   rootMargin: '400px',
//   threshold: 0,
// };

// const observer = new IntersectionObserver(onInfiniteScroll, options);

// let searchQuery = '';
// let page = 1;

// async function onSearchClick(e) {
//   e.preventDefault();
//   selectors.gallery.innerHTML = '';
//   page = 1;
//   searchQuery = e.currentTarget.searchQuery.value;
//   if (!searchQuery.trim()) {
//     return;
//   }

//   const {
//     data: { hits, totalHits },
//   } = await getGallery(searchQuery, page);

//   if (!totalHits) {
//     throw new Error(response.statusText);
//   } else if (page === 1) {
//     Notify.info(`Hooray! We found ${totalHits} images.`);
//   }

//   selectors.gallery.insertAdjacentHTML('beforeend', galleryMarkup(hits));

//   if (totalHits <= page * 40) {
//     Notify.info("We're sorry, but you've reached the end of search results.");
//     observer.unobserve(selectors.loadMoreGuard);
//   } else {
//     observer.observe(selectors.loadMoreGuard);
//   }
// }

// function onInfiniteScroll(entries) {
//   entries.forEach(entry => {
//     if (entry.isIntersecting) {
//       onLoadMore();
//     }
//   });
// }

// async function onLoadMore() {
//   page += 1;
//   const {
//     data: { hits, totalHits },
//   } = await getGallery(searchQuery, page);

//   if (!totalHits) {
//     Notify.failure(
//       'Sorry, there are no images matching your search query. Please try again.'
//     );
//   } else {
//     selectors.gallery.insertAdjacentHTML('beforeend', galleryMarkup(hits));
//   }
// }

// async function renderCards() {
//   try {
//     const {
//       data: { hits, totalHits },
//     } = await getGallery(searchQuery, page);
//     if (!totalHits) {
//       throw new Error(response.statusText);
//     } else if (page === 1) {
//       Notify.info(`Hooray! We found ${totalHits} images.`);
//     }
//     selectors.gallery.insertAdjacentHTML('beforeend', galleryMarkup(hits));
//     if (totalHits <= page * 40) {
//       Notify.info("We're sorry, but you've reached the end of search results.");
//       observer.unobserve(selectors.loadMoreGuard);
//     }
//   } catch (error) {
//     Notify.failure(
//       'Sorry, there are no images matching your search query. Please try again.'
//     );
//   }
//   simpleLightbox.refresh();
// }

import AxiosApiService from './find-image-api';
import galleryMarkup from './gallery-markup';
import smoothScroll from './smooth-scroll';
import { gallery } from './simple-lightbox';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const axiosApiService = new AxiosApiService();

const selectors = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

let totalHits = 0;

selectors.loadMoreBtn.classList.add('is-hidden');

selectors.searchForm.addEventListener('submit', onSearch);
selectors.loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(e) {
  e.preventDefault();
  removeMarkup();

  if (e.currentTarget.elements.searchQuery.value.trim() === '') {
    return Notify.failure('Please, enter a search query.');
  }

  axiosApiService.resetPage();
  axiosApiService.query = e.currentTarget.elements.searchQuery.value.trim();

  const images = await axiosApiService.fetchImages();

  if (images.hits.length === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  totalHits = images.totalHits;

  Notify.success(`Hooray! We found ${totalHits} images.`);

  totalHits -= images.hits.length;

  addToHTML(galleryMarkup(images.hits));

  if (totalHits !== 0) {
    selectors.loadMoreBtn.classList.remove('is-hidden');
  } else {
    selectors.loadMoreBtn.classList.add('is-hidden');
  }

  gallery.refresh();
}

async function onLoadMore() {
  const images = await axiosApiService.fetchImages();

  totalHits -= images.hits.length;

  addToHTML(galleryMarkup(images.hits));

  if (totalHits === 0 || totalHits < 0) {
    selectors.loadMoreBtn.style.display = 'none';
    Notify.info("We're sorry, but you've reached the end of search results.");
    return;
  }

  gallery.refresh();
  smoothScroll();
}

function addToHTML(markup) {
  selectors.gallery.insertAdjacentHTML('beforeend', markup);
}

function removeMarkup() {
  selectors.gallery.innerHTML = '';
}
