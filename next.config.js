/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const { withSentryConfig } = require('@sentry/nextjs')
const withTM = require('next-transpile-modules')([
  '@fullcalendar/common',
  '@fullcalendar/react',
  '@fullcalendar/daygrid',
  '@fullcalendar/list',
  '@fullcalendar/timegrid'
])

const moduleExports = withTM({
  trailingSlash: true,
  reactStrictMode: false,
  sentry: {
    disableServerWebpackPlugin: true,
    disableClientWebpackPlugin: true
  },
  experimental: {
    esmExternals: false,
    jsconfigPaths: true
  },
  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision')
    }
    
    return config
  },
  images: {
    domains: ['blackopal-images.s3.ap-south-1.amazonaws.com']
  }
})

const sentryWebpackPluginOptions = {
  silent: true
}

module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions)
