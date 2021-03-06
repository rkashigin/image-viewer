import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Breakpoint,
} from '@mui/material';

import { Image } from '../../interfaces';
import useConfirmDialogStyles from './styles';

interface ConfirmDialogProps {
  title: string;
  text: string;
  open: Image | number | null;
  onOk: () => void;
  handleClose: () => void;
  maxWidth?: Breakpoint;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title,
  text,
  open,
  onOk,
  handleClose,
  maxWidth,
}): React.ReactElement => {
  const classes = useConfirmDialogStyles();

  return (
    <Dialog maxWidth={maxWidth} open={Boolean(open)} onClose={handleClose} fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText className={classes.text}>{text}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onOk} color="primary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
