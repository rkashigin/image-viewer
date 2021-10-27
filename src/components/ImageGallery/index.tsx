import React from 'react';
import { Grid, CircularProgress, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';

import PhotoCard from '../ImageCard';
import { Image } from '../../interfaces';
import { imagesStore } from '../../stores';

interface ImageGalleryProps {
  imagesLoading: boolean;
  page: number;
}

const ImageGallery: React.FC<ImageGalleryProps> = observer(({ imagesLoading, page }) => (
  <Grid container item spacing={5} xs={12} justifyContent="center">
    {imagesLoading && (
      <Grid item>
        <CircularProgress />
      </Grid>
    )}
    {!imagesLoading &&
      (imagesStore.getImages.length ? (
        <Grid container item spacing={5} xs={12}>
          {imagesStore.getImages
            .slice(imagesStore.getImagesToShow * (page - 1), page * imagesStore.getImagesToShow)
            .map((image: Image) => (
              <PhotoCard image={image} />
            ))}
        </Grid>
      ) : (
        <Grid item>
          <Typography variant="body1">No images were found</Typography>
        </Grid>
      ))}
  </Grid>
));
export default ImageGallery;
