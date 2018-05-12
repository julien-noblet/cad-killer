/**
 * ./webpack.config.js
 *
 * @format
 */

const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: "./src/index.html",
  filename: "index.html",
  inject: "body"
});

var ImageminPlugin = require("imagemin-webpack-plugin").default;

module.exports = {
  devtool: "source-map",
  entry: {
    main: "./src/index.js",
    jquery: "jquery",
    leaflet: "leaflet",
    stats: ["pouchdb", "ua-parser-js", "leaflet-dialog", "leaflet-draw"],
    leaflet_plugins_a: ["leaflet-ajax", "leaflet-hash"],
    leaflet_plugins_b: ["leaflet-modal", "leaflet.photon"]
  },
  output: {
    path: path.resolve("dist"),
    filename: "[name]_bundle.js",
    chunkFilename: "[name].bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: [/node_modules/, /\.test\.js$/]
      },
      {
        test: /\.jsx$/,
        loader: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          //"style-loader",
          { loader: "css-loader", options: {} },
          { loader: "postcss-loader", options: {} },

          { loader: "sass-loader", options: {} } // compiles Sass to CSS
        ]
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: "css-loader", options: {} },
          { loader: "postcss-loader", options: {} }
        ]
      },
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        loader: "file-loader",
        options: {
          name: "fonts/[name].[ext]"
        }
      },
      {
        test: /\.(png|jpeg|jpg|gif)$/,
        loader: "file-loader",
        options: {
          name: "images/[name].[ext]"
        }
      }
    ]
  },
  plugins: [
    HtmlWebpackPluginConfig,
    new ImageminPlugin({
      disable: process.env.NODE_ENV !== "production", // Disable during development
      pngquant: {
        quality: "95-100"
      }
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.optimize\.css$/g,
      cssProcessor: require("cssnano"),
      cssProcessorOptions: { discardComments: { removeAll: true } },
      canPrint: true
    })
  ],
  optimization: {
    minimize: true,

    //runtimeChunk: true,
    splitChunks: {
      chunks: "async",
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: "~",
      name: false,
      cacheGroups: {
        styles: {
          name: "styles",
          test: /\.css$/,
          chunks: "all",
          enforce: true
        },
        leaflet: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        jquery: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        stats: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
};
