import { createSlice } from '@reduxjs/toolkit';

import { store } from './store'; // Import the store to access the state

const initialState = {
  cache: {},
};

const cacheDataSlice = createSlice({
  name: 'cache',
  initialState,
  reducers: {
    setCachedData: (state, action) => {
      const { url, data, timestamp } = action.payload;
      state.cache[url] = { data, timestamp };
    },
    removeCachedData: (state, action) => {
      const url = action.payload;
      delete state.cache[url];
    },
  },
});

const getCache = () => {
  const state = store.getState();
  return state.cache;
};

export const getCachedData = (url, cacheExpiration) => {
  const cached = getCache().cache[url];
  if (!cached) return null;

  const { timestamp, data } = cached;
  if (timestamp + cacheExpiration < Date.now()) {
    return null;
  }

  return data;
};

export const { setCachedData, removeCachedData } = cacheDataSlice.actions;

export default cacheDataSlice.reducer;
