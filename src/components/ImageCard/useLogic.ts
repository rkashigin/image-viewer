import React from 'react';

import { Image } from '../../interfaces';
import { imagesStore } from '../../stores';

export default function useLogic() {
  const [imageToDelete, setImageToDelete] = React.useState<Image | null>(null);
  const [imageToShow, setImageToShow] = React.useState<Image | null>(null);

  const handleDeleteImage = (imageId: Image) => {
    setImageToDelete(imageId);
  };

  const onConfirmPhotoDelete = () => {
    if (imageToDelete) {
      imagesStore.deleteImage(imageToDelete);
      setImageToDelete(null);
    }
  };

  const handleSelectImage = (image: Image) => {
    setImageToShow(image);
  };

  const handleClosePreview = () => {
    setImageToShow(null);
  };

  return {
    handleDeleteImage,
    onConfirmPhotoDelete,
    setImageToDelete,
    handleSelectImage,
    handleClosePreview,
    imageToShow,
    imageToDelete,
  };
}
