import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import tinycolor from 'tinycolor2';

const useToolbarStyles = makeStyles((theme: Theme) => ({
  selectItem: {
    display: 'flex !important',
    alignItems: 'center',
  },
  selectItemIcon: {
    fontSize: 18,
  },
  viewBtn: {
    width: 50,
    height: 50,
  },
  activeView: {
    backgroundColor: `${tinycolor(theme.palette.primary.main).lighten(10).toString()} !important`,
    border: 0,
    borderRadius: 3,
    color: 'white !important',
    padding: '0 30px',
  },
}));

export default useToolbarStyles;
