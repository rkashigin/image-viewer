import { Theme } from '@mui/material';
import { red } from '@mui/material/colors';
import { makeStyles } from '@mui/styles';
import tinycolor from 'tinycolor2';

const usePhotoCardStyles = makeStyles((theme: Theme) => ({
  btn: {
    width: 50,
    height: 50,
    color: 'white !important',
  },
  deleteBtn: {
    backgroundColor: `${red[500]} !important`,

    '&:hover': {
      backgroundColor: `${tinycolor(red[400]).lighten(5).toString()} !important`,
    },
  },
  previewBtn: {
    backgroundColor: `${theme.palette.primary.main} !important`,

    '&:hover': {
      backgroundColor: `${tinycolor(theme.palette.primary.main).lighten(5).toString()} !important`,
    },
  },
}));

export default usePhotoCardStyles;
