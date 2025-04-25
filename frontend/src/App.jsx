import { useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ErrorBoundary } from '@sentry/react';
import './App.css';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { Route, Routes } from 'react-router-dom';

import Layout from './components/Layout';
import Home from './components/Home';
import { lightTheme, darkTheme } from './styles/theme';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import Settings from './components/Settings';
import ResetPassword from './components/ResetPassword';
import Support from './components/Support';
import { toggleDarkMode } from './redux/themeSlice';

const App = () => {
  const dispatch = useDispatch();
  const isDarkModeEnabled = useSelector((state) => state.theme.isDarkMode);

  useEffect(() => {
    const storedThemePreference = localStorage.getItem('isDarkMode');
    if (storedThemePreference !== null) {
      dispatch(toggleDarkMode(storedThemePreference === 'true'));
    }
  }, [dispatch]);

  const currentTheme = useMemo(
    () => (isDarkModeEnabled ? darkTheme : lightTheme),
    [isDarkModeEnabled],
  );

  return (
    <ErrorBoundary fallback={<h2>An error has occurred</h2>}>
      <ThemeProvider theme={currentTheme}>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/support" element={<Support />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
