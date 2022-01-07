import './css/common.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import PixabayApiServise from './js/pixabay-fetch';
import picturesTpl from './templates/pictures.hbs';
import InfiniteScroll from 'infinite-scroll';

const refs = getRefs();
const pixabayApiServise = new PixabayApiServise();

refs.searchForm.addEventListener('submit', onSearch);

function onSearch(e) {
  e.preventDefault();
  pixabayApiServise.query = e.currentTarget.elements.searchQuery.value;
  pixabayApiServise.resetPage();

  appendPictureMarkup();
  simpleLightbox();
  clearPictureContainer();
}

function getRefs() {
  return {
    searchForm: document.querySelector('#search-form'),
    pictureContainer: document.querySelector('.gallery'),
  };
}

function clearPictureContainer() {
  refs.pictureContainer.innerHTML = '';
}

function notifyMessage(hits, totalHits) {
  if (hits.length === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );
  } else {
    Notify.success(`Hooray! We found ${totalHits} images.`);
  }
}
// if (hits.length === totalHits) {
//   Notify.failure(
//     `We're sorry, but you've reached the end of search results.`,
//   );
// }

function simpleLightbox() {
  let gallery = new SimpleLightbox('.photo-card a', {});
  gallery.refresh();
}

async function appendPictureMarkup() {
  try {
    const responce = await pixabayApiServise.fetchPicture();
    const {
      data: { hits, totalHits },
    } = responce;
    refs.pictureContainer.insertAdjacentHTML('beforeend', picturesTpl(hits));
    notifyMessage(hits, totalHits);
  } catch (error) {
    console.log(error.message);
  }
}
