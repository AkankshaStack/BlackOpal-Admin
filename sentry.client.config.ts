import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: process.env.NEXT_PUBLIC_SENTRY_ENV === 'prod' || process.env.NEXT_PUBLIC_SENTRY_ENV === 'production',
  environment:process.env.NEXT_PUBLIC_SENTRY_ENV,
  tracesSampleRate: 0.5
})