import { makeAutoObservable } from 'mobx';
import { Image } from '../interfaces/Image';

class ImagesStore {
  images: Image[] = [];

  filteredImages: Image[] = [];

  imagesToShow: number = 10;

  imagesDisplayStyle: string = localStorage.getItem('view') || 'grid';

  constructor() {
    makeAutoObservable(this);
  }

  get getDefaultImages(): Image[] {
    return this.images;
  }

  get getImages(): Image[] {
    return this.filteredImages;
  }

  get getImagesToShow(): number {
    return this.imagesToShow;
  }

  get getImagesDisplayStyle(): string {
    return this.imagesDisplayStyle;
  }

  setImages(images: Image[]) {
    this.images = images;
    this.filteredImages = images;
  }

  setFilteredImages(images: Image[]) {
    this.filteredImages = images;
  }

  deleteImage(imageToDelete: Image) {
    this.filteredImages = this.filteredImages.filter((image) => image.id !== imageToDelete.id);
  }

  setImagesToShow(imagesToShow: number) {
    this.imagesToShow = imagesToShow;
  }

  setImagesDisplayStyle(imagesDisplayStyle: string) {
    this.imagesDisplayStyle = imagesDisplayStyle;
  }
}

const imagesStore = new ImagesStore();

export default imagesStore;
