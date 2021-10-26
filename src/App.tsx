import React from 'react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Theme,
  Typography,
  Container,
  Grid,
  TextField,
  IconButton,
  Button,
  Paper,
  CircularProgress,
  Card,
  CardMedia,
  CardActions,
  CardHeader,
} from '@mui/material';
import GridViewIcon from '@mui/icons-material/GridView';
import TableRowsIcon from '@mui/icons-material/TableRows';
import SearchIcon from '@mui/icons-material/Search';
import PreviewIcon from '@mui/icons-material/ZoomIn';
import DeleteIcon from '@mui/icons-material/Delete';
import { makeStyles } from '@mui/styles';
import tinycolor from 'tinycolor2';
import classNames from 'classnames';
import axios from 'axios';
import { red } from '@mui/material/colors';
import config from './config';

interface Image {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  toolbar: {
    padding: theme.spacing(5),
    marginTop: theme.spacing(5),
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
  cardTitle: {
    textOverflow: 'ellipsis',
  },
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

const App: React.FC = (): React.ReactElement => {
  const classes = useStyles();
  const [view, setView] = React.useState(localStorage.getItem('view'));
  const [sort, setSort] = React.useState('');
  const [itemsOnPage, setItemsOnPage] = React.useState('10');
  const [images, setImages] = React.useState<Image[]>([]);
  const [imagesLoading, setImagesLoading] = React.useState(false);
  const fuse = new

  const hadleChangeView = (e: React.MouseEvent<HTMLButtonElement>) => {
    setView(e.currentTarget.name);

    localStorage.setItem('view', e.currentTarget.name);
  };

  const handleChangeSort = (e: SelectChangeEvent) => {
    setSort(e.target.value);
  };

  const handleChangeItemsOnPage = (e: SelectChangeEvent) => {
    setItemsOnPage(e.target.value);
  };

  React.useEffect(() => {
    (async () => {
      try {
        setImagesLoading(true);

        const { data } = await axios.get<Image[]>(
          `${config.server.host}${config.server.api.getAllImages.uri}`,
        );

        setImages(data);
      } finally {
        setImagesLoading(false);
      }
    })();
  }, []);

  return (
    <div className="App">
      <Container>
        <Typography variant="h3" align="center">
          Image Viewer App
        </Typography>
        <Paper elevation={5} className={classes.toolbar}>
          <Grid container spacing={5}>
            <Grid
              container
              item
              spacing={5}
              xs={12}
              alignItems="center"
              justifyContent="space-between"
              marginTop={0}
            >
              <Grid item xs={4}>
                <TextField
                  label="Search"
                  variant="outlined"
                  InputProps={{ startAdornment: <SearchIcon /> }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={3}>
                <FormControl fullWidth>
                  <InputLabel>Sort</InputLabel>
                  <Select value={sort} label="Sort" onChange={handleChangeSort}>
                    <MenuItem value={10}>By Album Number (Asc)</MenuItem>
                    <MenuItem value={20}>By Album Number (Desc)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <FormControl fullWidth>
                  <InputLabel>Items on page</InputLabel>
                  <Select
                    value={itemsOnPage}
                    label="Items on page"
                    onChange={handleChangeItemsOnPage}
                  >
                    <MenuItem value="10">Ten</MenuItem>
                    <MenuItem value="20">Twenty</MenuItem>
                    <MenuItem value="30">Thirty</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item>
                <IconButton
                  name="grid"
                  color="primary"
                  className={classNames(classes.viewBtn, {
                    [classes.activeView]: view === 'grid',
                  })}
                  onClick={hadleChangeView}
                >
                  <GridViewIcon />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton
                  name="table"
                  color="primary"
                  className={classNames(classes.viewBtn, {
                    [classes.activeView]: view === 'table',
                  })}
                  onClick={hadleChangeView}
                >
                  <TableRowsIcon />
                </IconButton>
              </Grid>
            </Grid>
            <Grid container item spacing={5} xs={12} justifyContent="center">
              {imagesLoading && (
                <Grid item>
                  <CircularProgress />
                </Grid>
              )}
              {!imagesLoading &&
                (images.length ? (
                  <Grid container item spacing={5} xs={12}>
                    {images.slice(0, parseInt(itemsOnPage)).map((image: Image) => (
                      <Grid item xs={4} key={image.id}>
                        <Card>
                          <CardHeader title={image.title.slice(0, 20)} />
                          <CardMedia
                            component="img"
                            height="100%"
                            image={image.thumbnailUrl}
                            alt={image.title}
                          />
                          <CardActions>
                            <Button
                              size="small"
                              className={classNames(classes.btn, classes.deleteBtn)}
                            >
                              <DeleteIcon />
                            </Button>
                            <Button
                              size="small"
                              className={classNames(classes.btn, classes.previewBtn)}
                            >
                              <PreviewIcon />
                            </Button>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Grid item>
                    <Typography variant="body1">No images were found</Typography>
                  </Grid>
                ))}
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </div>
  );
};

export default App;
