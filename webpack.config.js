/*
    ./webpack.config.js
*/

const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './src/index.html',
  filename: 'index.html',
  inject: 'body',
});

const ImageminPlugin = require('imagemin-webpack-plugin').default;

const ImageminPluginConfig = new ImageminPlugin({
  disable: process.env.NODE_ENV !== 'production', // Disable during development
  pngquant: {
    quality: '95-100',
  },
});

module.exports = {
  entry: ['babel-polyfill', './src/index.js'],
  devtool: 'source-map',
  output: {
    path: path.resolve('dist'),
    filename: 'index_bundle.js',
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: [/node_modules/,/\.test\.js$/],
    },
    {
      test: /\.jsx$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
    },
    {
      test: /\.scss$/,
      use: [
        {
          loader: 'style-loader', // creates style nodes from JS strings
        }, {
          loader: 'css-loader', // translates CSS into CommonJS
        /*}, {
          loader: 'resolve-url-loader', // resolve urls
          */
        }, {
          loader: 'sass-loader', // compiles Sass to CSS
        },
      ],
    },
    {
      test: /\.css$/,
      use: [
        {
          loader: 'style-loader', // creates style nodes from JS strings
        }, {
          loader: 'css-loader', // translates CSS into CommonJS
        },
      ],
    },
    {
      test: /\.(ttf|eot|woff|woff2)$/,
      loader: 'file-loader',
      options: {
        name: 'fonts/[name].[ext]',
      },
    },
    {
      test: /\.(png|jpeg|jpg|gif)$/,
      loader: 'file-loader',
      options: {
        name: 'images/[name].[ext]',
      },
    },
    ],
  },
  plugins: [
    HtmlWebpackPluginConfig,
    ImageminPluginConfig,
  ],
};
