/* eslint-env node */
// import path from 'path'
const CompressionPlugin = require('compression-webpack-plugin');
const path = require('path');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  devtool: 'inline-source-map',
  entry: './src/client/index.js',
  mode: 'development',
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist/'),
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            cacheCompression: false,
            envName: 'development',
          },
        },
      },
    ],
  },

  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new CompressionPlugin(),
    // new BundleAnalyzerPlugin(),
  ],
};
