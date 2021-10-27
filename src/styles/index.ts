import { red } from '@mui/material/colors';
import { makeStyles } from '@mui/styles';

const useCommonStyles = makeStyles(() => ({
  cancelButton: {
    minWidth: '30px !important',
    width: 30,
    color: `${red[500]} !important`,
    backgroundColor: `${red[50]} !important`,

    '&:hover': {
      backgroundColor: `${red[100]} !important`,
    },
  },
}));

export default useCommonStyles;
