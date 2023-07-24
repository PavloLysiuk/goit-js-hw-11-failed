import { getGallery } from './find-image-api';
import createMarkup from './create-markup';
import { lightbox } from './simple-lightbox';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const selectors = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
  loadMoreGuard: document.querySelector('.js-guard'),
};

const simpleLightbox = new SimpleLightbox('.photo-card a', {
  captionsData: 'alt',
  captionDelay: 250,
  captionPosition: 'bottom',
});

selectors.form.addEventListener('submit', onSearchClick);

const options = {
  root: null,
  rootMargin: '400px',
  threshold: 0,
};

const observer = new IntersectionObserver(onInfiniteScroll, options);

let searchQuery = '';
let page;

async function onSearchClick(e) {
  e.preventDefault();
  selectors.gallery.innerHTML = '';
  page = 1;
  searchQuery = e.currentTarget.searchQuery.value;
  if (!searchQuery.trim()) {
    return;
  }
  await renderCards();
  if (selectors.gallery.children.length === 40) {
    observer.observe(selectors.loadMoreGuard);
  }
}

function onInfiniteScroll(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      onLoadeMore();
    }
  });
}

async function onLoadeMore() {
  page += 1;
  await renderCards();
}

async function renderCards() {
  try {
    const {
      data: { hits, totalHits },
    } = await getGallery(searchQuery, page);
    if (!totalHits) {
      throw new Error('Empty');
    } else if (page === 1) {
      Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
    }
    selectors.gallery.insertAdjacentHTML('beforeend', createMarkup(hits));
    if (totalHits <= page * 40) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      observer.unobserve(selectors.loadMoreGuard);
    }
  } catch (error) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  simpleLightbox.refresh();
}
