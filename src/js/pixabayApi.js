const KEY = "19208732-d576ebf05df8698a7fd7a6436";
const BASE_URL = "https://pixabay.com/api/";

export default class PixabayAPI{
  
  constructor() {
    this.searchQuery = "";
    this.page = 1;
  }
  
  async fetchPictures() {
    const url = `${BASE_URL}?key=${KEY}&image_type=photo&orientation=horizontal&q=${this.searchQuery}&page=${this.page}&per_page=12`


    const response = await fetch(url);
      const pict = await response.json()

        this.incrementPage()
    return pict;
      }

    // return fetch(url).then(response => response.json())
    //   .then((picture) => {
    //     this.incrementPage();
    //     return picture;
    //   })  

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
  }