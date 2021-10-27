import React from 'react';
import { SelectChangeEvent } from '@mui/material';

import { ToolbarProps } from './index';
import { imagesStore } from '../../stores';

export default function useLogic({ setPage }: ToolbarProps) {
  const [sort, setSort] = React.useState('');
  const [searchValue, setSearchValue] = React.useState('');

  const hadleChangeView = (e: React.MouseEvent<HTMLButtonElement>) => {
    imagesStore.setImagesDisplayStyle(e.currentTarget.name);

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
    imagesStore.setImagesToShow(Number(e.target.value));
    setPage(1);
  };

  return {
    sort,
    searchValue,
    hadleChangeView,
    handleChangeSearchValue,
    handleChangeSort,
    handleClearSort,
    handleChangeItemsOnPage,
  };
}
