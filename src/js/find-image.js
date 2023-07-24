import { getGallery } from './find-image-api';
import createMarkup from './gallery-markup';
import { lightbox } from './simple-lightbox';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const selectors = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
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
let page = 1;

async function onSearchClick(e) {
  e.preventDefault();
  selectors.gallery.innerHTML = '';
  page = 1;
  searchQuery = e.currentTarget.searchQuery.value;
  if (!searchQuery.trim()) {
    return;
  }

  const {
    data: { hits, totalHits },
  } = await getGallery(searchQuery, page);

  if (!totalHits) {
    throw new Error(response.statusText);
  } else if (page === 1) {
    Notify.info(`Hooray! We found ${totalHits} images.`);
  }

  selectors.gallery.insertAdjacentHTML('beforeend', createMarkup(hits));

  if (totalHits <= page * 40) {
    Notify.info("We're sorry, but you've reached the end of search results.");
    observer.unobserve(selectors.loadMoreGuard);
  } else {
    observer.observe(selectors.loadMoreGuard);
  }
}

function onInfiniteScroll(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      onLoadMore();
    }
  });
}

async function onLoadMore() {
  page += 1;
  const {
    data: { hits, totalHits },
  } = await getGallery(searchQuery, page);

  if (!totalHits) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    selectors.gallery.insertAdjacentHTML('beforeend', createMarkup(hits));
  }
}

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
//     selectors.gallery.insertAdjacentHTML('beforeend', createMarkup(hits));
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
