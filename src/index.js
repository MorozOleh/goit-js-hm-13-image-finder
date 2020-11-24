import './styles.css';
import '../node_modules/basiclightbox/dist/basicLightbox.min.css';
import '../node_modules/material-design-icons/iconfont/material-icons.css';
import "@pnotify/core/dist/PNotify.css";
import "@pnotify/core/dist/BrightTheme.css";
import pic from './templates/pictures.hbs'
import * as basicLightbox from 'basiclightbox'
import PixabayApi from './js/pixabayApi'
import { error } from '../node_modules/@pnotify/core/dist/PNotify.js';
import './js/render.js'


const refs = {
  searchForm: document.querySelector('.js-search-form'),
  galleryContainer: document.querySelector('.js-gallery-container'),
};

const pixabayApi = new PixabayApi();
refs.searchForm.addEventListener('submit', onSearch);

function onSearch(e) {
  e.preventDefault();
  pixabayApi.query = e.currentTarget.elements.query.value;
  if (pixabayApi.query === '') {

    return error({
    text: 'try something other!'
  });}

  pixabayApi.resetPage();
  clearGalleryContainer();
  fetchPictures();
}

// refactoring;
async function fetchPictures() {
  const response = await pixabayApi.fetchPictures();
  const result = await response;
    if (result.hits.length === 0) {
      return error({
    text: 'try something other!'
      })
  };
    appendPicturesMark(result);
    document.querySelector('.gallery').addEventListener('click', onClick);

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
    <img class='basicLightbox__image' src="${valueData}" >
`)
instance.show()
}


// initialize intersection observer;

const onEntries = entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && pixabayApi.query !== '') {
  fetchPictures();
}})
};


const options = {
  rootMargin: '350px',
};
const observer = new IntersectionObserver(onEntries, options);

const sentinel = document.querySelector('.sentinel');
observer.observe(sentinel);