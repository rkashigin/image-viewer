import React from 'react';
import ReactDOM from 'react-dom';
import { Grid, Button, Card, CardMedia, CardActions, CardHeader, Typography } from '@mui/material';
import PreviewIcon from '@mui/icons-material/ZoomIn';
import DeleteIcon from '@mui/icons-material/Delete';
import classNames from 'classnames';

import { observer } from 'mobx-react-lite';
import { Image } from '../../interfaces';
import { imagesStore } from '../../stores';
import usePhotoCardStyles from './styles';
import useLogic from './useLogic';
import ConfirmDialog from '../ConfirmDialog';
import Preview from '../Preview';

interface ImageCardProps {
  image: Image;
}

const ImageCard: React.FC<ImageCardProps> = observer(({ image }): React.ReactElement => {
  const classes = usePhotoCardStyles();
  const {
    handleDeleteImage,
    onConfirmPhotoDelete,
    setImageToDelete,
    handleSelectImage,
    handleClosePreview,
    imageToShow,
    imageToDelete,
  } = useLogic();

  return (
    <>
      {imagesStore.getImagesDisplayStyle === 'grid' ? (
        <Grid item xs={4} key={image.id}>
          <Card>
            <CardHeader title={image.title.slice(0, 20)} subheader={`Album ID: ${image.albumId}`} />
            <CardMedia component="img" height="100%" image={image.thumbnailUrl} alt={image.title} />
            <CardActions>
              <Button
                size="small"
                className={classNames(classes.btn, classes.deleteBtn)}
                onClick={() => handleDeleteImage(image)}
              >
                <DeleteIcon />
              </Button>
              <Button
                size="small"
                className={classNames(classes.btn, classes.previewBtn)}
                onClick={() => handleSelectImage(image)}
              >
                <PreviewIcon />
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ) : (
        <Grid
          container
          item
          spacing={5}
          xs={12}
          key={image.id}
          alignItems="center"
          justifyContent="space-between"
        >
          <Grid item xs={4}>
            <img src={image.thumbnailUrl} alt={image.title} height="50%" width="100%" />
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h5" align="center">
              {image.title.slice(0, 20)}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="body1" align="center">{`Album ID: ${image.albumId}`}</Typography>
          </Grid>
          <Grid container item spacing={2} xs={2}>
            <Grid item>
              <Button
                size="small"
                className={classNames(classes.btn, classes.deleteBtn)}
                onClick={() => handleDeleteImage(image)}
              >
                <DeleteIcon />
              </Button>
            </Grid>
            <Grid item>
              <Button
                size="small"
                className={classNames(classes.btn, classes.previewBtn)}
                onClick={() => handleSelectImage(image)}
              >
                <PreviewIcon />
              </Button>
            </Grid>
          </Grid>
        </Grid>
      )}
      {imageToDelete?.id === image.id &&
        ReactDOM.createPortal(
          <ConfirmDialog
            title="Confirm photo deletion"
            text="Are you sure that you want to delete this photo? This action is permanent!"
            open={imageToDelete}
            onOk={onConfirmPhotoDelete}
            handleClose={() => setImageToDelete(null)}
            maxWidth="sm"
          />,
          document.body
        )}
      {imageToShow?.id === image.id &&
        ReactDOM.createPortal(
          <Preview image={imageToShow} open={imageToShow} handleClose={handleClosePreview} />,
          document.body
        )}
    </>
  );
});

export default ImageCard;
