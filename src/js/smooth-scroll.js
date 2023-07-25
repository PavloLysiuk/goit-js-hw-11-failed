export default function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  setTimeout(() => {
    window.scrollBy({
      top: cardHeight * 4,
      behavior: 'smooth',
    });
  }, 300);
}
