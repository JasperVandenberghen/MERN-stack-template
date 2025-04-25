import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.SENTRY_FRONTEND_DSN,
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
});
// Manually call startProfiler and stopProfiler
// to profile the code in between
Sentry.profiler.startProfiler();

// Starts a transaction that will also be profiled
Sentry.startSpan(
  {
    name: 'My First Transaction',
  },
  () => {
    // the code executing inside the transaction will be wrapped in a span and profiled
  },
);

// Calls to stopProfiling are optional - if you don't stop the profiler, it will keep profiling
// your application until the process exits or stopProfiling is called.
Sentry.profiler.stopProfiler();
