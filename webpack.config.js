const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },
  devtool: "cheap-module-eval-source-map",
  entry: './src/selector.js',
  mode: `${process.env.NODE_ENV}`,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'selector.min.js',
    library: 'selector',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader'
      },
      {
        test: /\.scss$/,
        use: [
          process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
        {
          loader: "css-loader",
          options: {
            sourceMap: true,
          }
        }, {
          loader: "postcss-loader",
          options: {
            config: {
              ctx: {
                autoprefixer: {}
              }
            }
          }
        }, {
          loader: "sass-loader",
          options: {
            sourceMap: true,
          }
        }]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "style.css",
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
      filename: path.resolve(__dirname, 'index.html'),
      inject: 'head'
    })
  ],
  externals: {
    'jquery': 'jQuery',
    '$': 'jQuery'
  },
};