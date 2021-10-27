import React from 'react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Grid,
  TextField,
  IconButton,
  Button,
} from '@mui/material';
import GridViewIcon from '@mui/icons-material/GridView';
import TableRowsIcon from '@mui/icons-material/TableRows';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import Fuse from 'fuse.js';
import { orderBy } from 'lodash';

import useToolbarStyles from './styles';
import useCommonStyles from '../../styles';
import useLogic from './useLogic';
import { imagesStore } from '../../stores';

export interface ToolbarProps {
  setPage: (page: number) => void;
}

const Toolbar: React.FC<ToolbarProps> = observer(({ setPage }): React.ReactElement => {
  const commonClasses = useCommonStyles();
  const classes = useToolbarStyles();
  const {
    hadleChangeView,
    handleChangeItemsOnPage,
    handleChangeSearchValue,
    handleChangeSort,
    handleClearSort,
    searchValue,
    sort,
  } = useLogic({ setPage });
  const fuse = new Fuse(imagesStore.getImages, {
    keys: ['title'],
    threshold: 0.2,
    distance: 30,
  });

  React.useEffect(() => {
    if (searchValue) {
      const searchData = fuse.search(searchValue);

      imagesStore.setFilteredImages(searchData.map(({ item }) => item));
    } else {
      imagesStore.setFilteredImages(imagesStore.getDefaultImages);
    }

    /* eslint-disable-next-line */
  }, [searchValue]);

  React.useEffect(() => {
    if (sort) {
      imagesStore.setFilteredImages(
        orderBy(imagesStore.getImages, ['albumId'], sort === 'asc' ? 'asc' : 'desc')
      );
    } else {
      imagesStore.setImages(imagesStore.getDefaultImages);
    }

    setPage(1);

    /* eslint-disable-next-line */
  }, [sort]);

  return (
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
            <Button size="small" className={commonClasses.cancelButton} onClick={handleClearSort}>
              <ClearIcon />
            </Button>
          </Grid>
        )}
      </Grid>
      <Grid item xs={3}>
        <FormControl fullWidth>
          <InputLabel>Items on page</InputLabel>
          <Select
            value={String(imagesStore.getImagesToShow)}
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
            [classes.activeView]: imagesStore.getImagesDisplayStyle === 'grid',
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
            [classes.activeView]: imagesStore.getImagesDisplayStyle === 'table',
          })}
          onClick={hadleChangeView}
        >
          <TableRowsIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
});

export default Toolbar;
