import React from 'react';
import { Theme, Typography, Container, Grid, Paper, Pagination } from '@mui/material';
import { makeStyles } from '@mui/styles';
import axios from 'axios';

import { observer } from 'mobx-react-lite';
import config from './config';
import { imagesStore } from './stores';
import { Image } from './interfaces';
import { ImageGallery, Toolbar } from './components';

const useStyles = makeStyles((theme: Theme) => ({
  toolbar: {
    padding: theme.spacing(5),
    marginTop: theme.spacing(5),
  },
  cardTitle: {
    textOverflow: 'ellipsis',
  },
}));

const App: React.FC = observer((): React.ReactElement => {
  const classes = useStyles();
  const tableTopRef = React.useRef<HTMLDivElement>(null);
  const [imagesLoading, setImagesLoading] = React.useState(false);
  const [page, setPage] = React.useState(1);

  const handleChangePage = (event: React.ChangeEvent<any>, page: number) => {
    setPage(page);

    if (tableTopRef.current) {
      tableTopRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  React.useEffect(() => {
    (async () => {
      try {
        setImagesLoading(true);

        const { data } = await axios.get<Image[]>(
          `${config.server.host}${config.server.api.getAllImages.uri}`
        );

        imagesStore.setImages(data);
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
        <Paper elevation={5} className={classes.toolbar} ref={tableTopRef}>
          <Grid container spacing={5}>
            <Toolbar setPage={setPage} />
            <ImageGallery page={page} imagesLoading={imagesLoading} />
            {!imagesLoading && !!imagesStore.getImages.length && (
              <Grid container item xs={12} justifyContent="flex-end">
                <Grid item>
                  <Pagination
                    count={Math.floor(imagesStore.getImages.length / imagesStore.imagesToShow)}
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
    </div>
  );
});

export default App;
