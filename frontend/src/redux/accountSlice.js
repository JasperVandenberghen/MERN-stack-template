import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  deleting: false,
  error: null,
};

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    startDeleting: (state) => {
      state.deleting = true;
      state.error = null;
    },
    deleteSuccess: (state) => {
      state.deleting = false;
      state.error = null;
    },
    deleteError: (state, { payload: error }) => {
      state.deleting = false;
      state.error = error;
    },
  },
});

export const { startDeleting, deleteSuccess, deleteError } =
  accountSlice.actions;
export default accountSlice.reducer;
