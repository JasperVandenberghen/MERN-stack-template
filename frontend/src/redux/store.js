import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import sessionStorage from 'redux-persist/lib/storage/session';
import storage from 'redux-persist/lib/storage';

import sessionReducer from './sessionSlice';
import themeReducer from './themeSlice';
import cacheDataReducer from './cacheDataSlice';

const rememberMe = true; // This should ideally come from user settings

// Persist Config
const persistConfig = {
  key: 'root',
  storage: rememberMe ? storage : sessionStorage,
  whitelist: ['session', 'theme', 'cache'], // Make sure to persist cache if needed
};

const rootReducer = combineReducers({
  session: sessionReducer,
  theme: themeReducer,
  cache: cacheDataReducer,
});

// Persisted Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Store Setup
const store = configureStore({
  reducer: (state, action) => {
    if (action.type === 'session/logout') {
      // Reset state while keeping the persisted reducers intact
      state = {
        theme: state.theme, // Keep theme settings
        cache: state.cache, // Keep cached data (optional)
      };
    }
    return persistedReducer(state, action);
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PURGE',
        ],
      },
    }),
});

// Persistor
const persistor = persistStore(store);

export { store, persistor };
