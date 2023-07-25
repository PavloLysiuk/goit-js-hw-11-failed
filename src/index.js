import AxiosApiService from './js/find-image-api';
import galleryMarkup from './js/gallery-markup';
import smoothScroll from './js/smooth-scroll';
import { gallery } from './js/simple-lightbox';
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

  selectors.loadMoreBtn.classList.add('is-hidden');

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
