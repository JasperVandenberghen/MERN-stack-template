import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token:
    localStorage.getItem('authToken') ||
    sessionStorage.getItem('authToken') ||
    null,
  user:
    JSON.parse(localStorage.getItem('user')) ||
    JSON.parse(sessionStorage.getItem('user')) ||
    null,
  rememberMe: JSON.parse(localStorage.getItem('rememberMe')) || false,
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    login: (state, { payload: { token, user } }) => {
      state.token = token;
      state.user = user;
      const storage = state.rememberMe ? localStorage : sessionStorage;
      storage.setItem('authToken', token);
      storage.setItem('user', JSON.stringify(user));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.rememberMe = false;

      const isDarkMode = localStorage.getItem('isDarkMode'); // Preserve isDarkMode
      [localStorage, sessionStorage].forEach((storage) => {
        storage.removeItem('authToken');
        storage.removeItem('user');
      });

      localStorage.removeItem('rememberMe');
      if (isDarkMode !== null) {
        localStorage.setItem('isDarkMode', isDarkMode); // Restore isDarkMode
      }
    },
    updateUser: (state, { payload: userData }) => {
      state.user = { ...state.user, ...userData };

      const storage = state.rememberMe ? localStorage : sessionStorage;
      storage.setItem('user', JSON.stringify(state.user));
    },
    updateRememberMe: (state, { payload: rememberMe }) => {
      state.rememberMe = rememberMe;
      localStorage.setItem('rememberMe', JSON.stringify(rememberMe));
    },
  },
});

export const { login, logout, updateUser, updateRememberMe } =
  sessionSlice.actions;
export default sessionSlice.reducer;
