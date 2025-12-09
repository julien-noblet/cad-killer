/**
 * ./webpack.config.js
 *
 * @format
 */

const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: "./src/index.html",
  filename: "index.html",
  inject: "body",
});
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  devtool: "source-map",
  mode: "development",
  devServer: {
    static: path.resolve(__dirname, "dist"),
    port: 9000,
  },
  entry: {
    index: "./src/index.js",
    leaflet: "leaflet",
    stats: ["leaflet-dialog", "leaflet-draw"],
    leaflet_plugins_a: ["leaflet-ajax", "leaflet-hash"],
    leaflet_plugins_b: ["leaflet-modal", "leaflet.photon"],
  },
  output: {
    path: path.resolve("dist"),
    filename: "[name]_bundle.js",
    chunkFilename: "[name].bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: [/node_modules/, /\.test\.js$/],
      },
      {
        test: /\.jsx$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          //"style-loader",
          { loader: "css-loader", options: {} },
          { loader: "postcss-loader", options: {} },

          {
            loader: "sass-loader",
            options: {
              sassOptions: {
                quietDeps: true,
                silenceDeprecations: ["import", "global-builtin", "slash-div"],
              },
            },
          }, // compiles Sass to CSS
        ],
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: "css-loader", options: {} },
          { loader: "postcss-loader", options: {} },
        ],
      },
      {
        test: /\.(ttf|eot|woff|woff2)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]'
        }
      },
      {
        test: /\.(png|jpeg|jpg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name][ext]'
        }
      },
      {
        test: /^brave-rewards-verification\.txt/,
        loader: "file-loader",
        options: {
          name: ".well-known/brave-rewards-verification.txt",
        },
      },
    ],
  },
  ignoreWarnings: [
    /Deprecation Warning/,
    /Sass @import rules/,
    /Using \/ for division/,
  ],
  plugins: [
    HtmlWebpackPluginConfig,
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
    new CopyWebpackPlugin({ patterns: [{ from: "static" }] }),
    new MiniCssExtractPlugin(),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
      // `...`,
      new CssMinimizerPlugin(),
    ],
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
          enforce: true,
        },
        leaflet: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
        },
        stats: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
};
