const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    historyApiFallback: true,
    proxy: [
      {
        context: ['/api', '/sse', '/themes'],
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    ],
    compress: false
  }
})
