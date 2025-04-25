import * as Sentry from '@sentry/node';
import './sentry.js';
import authRoutes from './routes/authRoutes.js';
import connectDB from './db.js';
import cors from 'cors';
import express from 'express';

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization,x-api-key',
  }),
);
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    // TODO: add status info about the server here later
  res.json({ Aftermatch_API: 'available' });

});
app.use('/api/auth', authRoutes);

app.use(function onError(err, req, res, _next) {
  res.statusCode = 500;
  // res.end(res.sentry + '\n'); TODO: provide a generic message to not expose error details
  res.json({ error: 'Something went wrong, please try again later.' });
  Sentry.captureException(err);
});


let server;
if (process.env.NODE_ENV !== 'test') {
  connectDB();

  const PORT = process.env.PORT || 5000;
  server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

const startServer = async () => {
  // TODO: consider logging routine logs with Winston
  try {
    const port = process.env.TEST_PORT || 5002;
    server = app.listen(port, () => {
      console.info(`Server running on port ${port}`);
    });

    await new Promise((resolve, reject) => {
      server.once('listening', resolve);
      server.once('error', reject);
    });
  } catch (err) {
    Sentry.captureException(err);
    throw err;
  }
};

const stopServer = async () => {
  if (!server) return;

  const timeout = setTimeout(() => {
    console.error('Server did not shut down gracefully, forcefully closing...');
    process.exit(1); 
  }, 10000);

  try {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  } catch (err) {
    Sentry.captureException(err);
  } finally {
    clearTimeout(timeout);
  }
};


export { app, startServer, stopServer };
