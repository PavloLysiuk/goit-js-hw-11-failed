import { getGallery } from './find-image-api';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';












function createMarkup(data) {
  return data.map(
    ({
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    }) => {
      return `<div class="image-item">

    <a href="${largeImageURL}">

      <img class="photo-img" src="${webformatURL}" alt="${tags}" loading="lazy" />
    </a>

    <div class="info">
      <p class="info-item">
        <b>Likes</b>
        ${likes}
      </p>

      <p class="info-item">
        <b>Views</b>
        ${views}
      </p>

      <p class="info-item">
        <b>Comments</b>
        ${comments}
      </p>

      <p class="info-item">
        <b>Downloads</b>
        ${downloads}
      </p>
    </div>
    </div>`;
    }
  );
}
