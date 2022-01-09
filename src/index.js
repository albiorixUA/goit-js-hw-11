import './css/common.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import PixabayApiServise from './js/pixabay-fetch';
import picturesTpl from './templates/pictures.hbs';

const refs = getRefs();
const pixabayApiServise = new PixabayApiServise();
let perPage = 0;

refs.searchForm.addEventListener('submit', onSearch);

function onSearch(e) {
  e.preventDefault();
  pixabayApiServise.query = e.currentTarget.elements.searchQuery.value;
  pixabayApiServise.resetPage();
  perPage = 0;
  appendPictureMarkup();
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

function notifyMessage(hits, totalHits, perPage) {
  if (hits.length !== 0 && perPage === pixabayApiServise.per_page) {
    Notify.success(`Hooray! We found ${totalHits} images.`);
  }
  if (hits.length === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );
  }
  if (perPage > totalHits) {
    Notify.failure(
      `We're sorry, but you've reached the end of search results.`,
    );
  }
}

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
    perPageCounter();
    notifyMessage(hits, totalHits, perPage);
  } catch (error) {
    console.log(error.message);
  }
  simpleLightbox();
}

function perPageCounter() {
  perPage += pixabayApiServise.per_page;
}

window.addEventListener('scroll', () => {
  if (
    window.scrollY + window.innerHeight >=
    document.documentElement.scrollHeight
  ) {
    appendPictureMarkup();
  }
});
