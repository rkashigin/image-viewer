import React from 'react';
import { Button, Dialog, Fade } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import classNames from 'classnames';

import { Image } from '../../interfaces';
import useCommonStyles from '../../styles';
import usePreviewStyles from './styles';

interface PreviewProps {
  image: Image;
  open: Image | boolean | null;
  handleClose: () => void;
}

const Preview: React.FC<PreviewProps> = ({ image, open, handleClose }): React.ReactElement => {
  const commonClasses = useCommonStyles();
  const classes = usePreviewStyles();

  return (
    <Dialog open={Boolean(open)} TransitionComponent={Fade} onClose={handleClose}>
      <Button
        size="small"
        className={classNames(commonClasses.cancelButton, classes.closeButton)}
        onClick={handleClose}
      >
        <ClearIcon />
      </Button>
      <img src={image.url} alt={image.title} />
    </Dialog>
  );
};

export default Preview;
