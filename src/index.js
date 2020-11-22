import './styles.css';
import './styles.scss';
import '../node_modules/basiclightbox/dist/basicLightbox.min.css';
import "@pnotify/core/dist/PNotify.css";
import "@pnotify/core/dist/BrightTheme.css";
import pic from './templates/pictures.hbs'
import * as basicLightbox from 'basiclightbox'
import PixabayApi from './js/pixabayApi'
import { alert, defaultModules } from '../node_modules/@pnotify/core/dist/PNotify.js';
import './js/render.js'


const refs = {
  searchForm: document.querySelector('.js-search-form'),
  galleryContainer: document.querySelector('.js-gallery-container'),
};

const pixabayApi = new PixabayApi();
refs.searchForm.addEventListener('submit', onSearch);

function onSearch(e) {
  e.preventDefault();
  pixabayApi.searchQuery = e.currentTarget.elements.query.value;
  if (pixabayApi.searchQuery === '') {

    return alert({
    text: 'try something other!'
  });}

  pixabayApi.resetPage();
  clearGalleryContainer();
  fetchPictures();
}

function fetchPictures() {
  pixabayApi.fetchPictures().then(picture => {
    appendPicturesMark(picture);
    document.querySelector('.gallery').addEventListener('click', onClick);
  })
}

function appendPicturesMark(pictures) {
  refs.galleryContainer.insertAdjacentHTML('beforeend', pic(pictures));

}

function clearGalleryContainer() {
  refs.galleryContainer.innerHTML = '';
}

// initialize basicLightbox;
function onClick(e) {
  if (e.target.nodeName !== 'IMG') {
    return;
}
const valueData = e.target.dataset.source;
const instance = basicLightbox.create(`
    <img class='basicLightbox__image' src="" >
`)
instance.show()
  const image = document.querySelector('.basicLightbox__image');
  image.src = valueData;
}


// initialize intersection observer;

const onEntries = entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && pixabayApi.searchQuery !== '') {
  fetchPictures();
}})
};


const options = {
  rootMargin: '250px',
};
const observer = new IntersectionObserver(onEntries, options);

const sentinel = document.querySelector('.sentinel');
observer.observe(sentinel);