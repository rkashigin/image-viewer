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
  Pagination,
} from '@mui/material';
import GridViewIcon from '@mui/icons-material/GridView';
import TableRowsIcon from '@mui/icons-material/TableRows';
import SearchIcon from '@mui/icons-material/Search';
import PreviewIcon from '@mui/icons-material/ZoomIn';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { makeStyles } from '@mui/styles';
import tinycolor from 'tinycolor2';
import classNames from 'classnames';
import axios from 'axios';
import { red } from '@mui/material/colors';
import Fuse from 'fuse.js';
import { orderBy } from 'lodash';

import config from './config';
import { ConfirmDialog } from './components';

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
  clearFilterBtn: {
    minWidth: '30px !important',
    width: 30,
    color: `${red[500]} !important`,
    backgroundColor: `${red[50]} !important`,

    '&:hover': {
      backgroundColor: `${red[100]} !important`,
    },
  },
  selectItem: {
    display: 'flex !important',
    alignItems: 'center',
  },
  selectItemIcon: {
    fontSize: 18,
  },
}));

const App: React.FC = (): React.ReactElement => {
  const classes = useStyles();
  const tableTopRef = React.useRef<HTMLDivElement>(null);
  const [view, setView] = React.useState(localStorage.getItem('view'));
  const [sort, setSort] = React.useState('');
  const [searchValue, setSearchValue] = React.useState('');
  const [itemsOnPage, setItemsOnPage] = React.useState(10);
  const [images, setImages] = React.useState<Image[]>([]);
  const [filteredImages, setFilteredImages] = React.useState<Image[]>([]);
  const [imagesLoading, setImagesLoading] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [photoToDelete, setPhotoToDelete] = React.useState<number | null>(null);
  const fuse = new Fuse(images, {
    keys: ['title'],
    threshold: 0.2,
    distance: 30,
  });

  const hadleChangeView = (e: React.MouseEvent<HTMLButtonElement>) => {
    setView(e.currentTarget.name);

    localStorage.setItem('view', e.currentTarget.name);
  };

  const handleChangeSearchValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (sort) {
      setSort('');
    }

    setSearchValue(e.target.value);
  };

  const handleChangeSort = (e: SelectChangeEvent) => {
    const sort = e.target.value;

    setSort(sort);
  };

  const handleClearSort = () => {
    setSort('');
  };

  const handleChangeItemsOnPage = (e: SelectChangeEvent) => {
    setItemsOnPage(Number(e.target.value));
  };

  const handleChangePage = (event: React.ChangeEvent<any>, page: number) => {
    setPage(page);

    if (tableTopRef.current) {
      tableTopRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDeleteImage = (imageId: number) => {
    setPhotoToDelete(imageId);
  };

  const onConfirmPhotoDelete = () => {
    setImages((prevImages) => prevImages.filter((image) => image.id !== photoToDelete));
    setPhotoToDelete(null);
  };

  React.useEffect(() => {
    (async () => {
      try {
        setImagesLoading(true);

        const { data } = await axios.get<Image[]>(
          `${config.server.host}${config.server.api.getAllImages.uri}`
        );

        setImages(data);
      } finally {
        setImagesLoading(false);
      }
    })();
  }, []);

  React.useEffect(() => {
    setFilteredImages(images);
  }, [images]);

  React.useEffect(() => {
    if (searchValue) {
      const searchData = fuse.search(searchValue);

      setFilteredImages(searchData.map(({ item }) => item));
    } else {
      setFilteredImages(images);
    }

    /* eslint-disable-next-line */
  }, [searchValue]);

  React.useEffect(() => {
    if (sort) {
      setFilteredImages((prevImages) =>
        orderBy(prevImages, ['albumId'], sort === 'asc' ? 'asc' : 'desc')
      );
    } else {
      setFilteredImages(images);
    }

    setPage(1);

    /* eslint-disable-next-line */
  }, [sort]);

  return (
    <div className="App">
      <Container>
        <Typography variant="h3" align="center">
          Image Viewer App
        </Typography>
        <Paper elevation={5} className={classes.toolbar}>
          <Grid container spacing={5} ref={tableTopRef}>
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
                  value={searchValue}
                  onChange={handleChangeSearchValue}
                  InputProps={{ startAdornment: <SearchIcon /> }}
                  fullWidth
                />
              </Grid>
              <Grid container item spacing={2} xs={3} alignItems="center">
                <Grid item xs={sort ? 11 : 12}>
                  <FormControl fullWidth>
                    <InputLabel>Sort</InputLabel>
                    <Select
                      value={sort}
                      label="Sort"
                      onChange={handleChangeSort}
                      classes={{
                        select: classes.selectItem,
                      }}
                    >
                      <MenuItem value="asc">
                        Album Number <ArrowUpwardIcon className={classes.selectItemIcon} />
                      </MenuItem>
                      <MenuItem value="desc">
                        Album Number <ArrowDownwardIcon className={classes.selectItemIcon} />
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                {sort && (
                  <Grid item xs={1}>
                    <Button
                      size="small"
                      className={classes.clearFilterBtn}
                      onClick={handleClearSort}
                    >
                      <ClearIcon />
                    </Button>
                  </Grid>
                )}
              </Grid>
              <Grid item xs={3}>
                <FormControl fullWidth>
                  <InputLabel>Items on page</InputLabel>
                  <Select
                    value={String(itemsOnPage)}
                    label="Items on page"
                    onChange={handleChangeItemsOnPage}
                  >
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
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
                (filteredImages.length ? (
                  <Grid container item spacing={5} xs={12}>
                    {filteredImages
                      .slice(itemsOnPage * (page - 1), page * itemsOnPage)
                      .map((image: Image) => (
                        <Grid item xs={4} key={image.id}>
                          <Card>
                            <CardHeader
                              title={image.title.slice(0, 20)}
                              subheader={`Album ID: ${image.albumId}`}
                            />
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
                                onClick={() => handleDeleteImage(image.id)}
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
            {!imagesLoading && !!images.length && (
              <Grid container item xs={12} justifyContent="flex-end">
                <Grid item>
                  <Pagination
                    count={Math.floor(filteredImages.length / itemsOnPage)}
                    boundaryCount={2}
                    page={page}
                    onChange={handleChangePage}
                    color="primary"
                  />
                </Grid>
              </Grid>
            )}
          </Grid>
        </Paper>
      </Container>
      <ConfirmDialog
        title="Confirm photo deletion"
        text="Are you sure that you want to delete this photo? This action is permanent!"
        open={photoToDelete}
        onOk={onConfirmPhotoDelete}
        handleClose={() => setPhotoToDelete(null)}
        maxWidth="sm"
      />
    </div>
  );
};

export default App;
