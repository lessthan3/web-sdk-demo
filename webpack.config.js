const { join } = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const PRODUCTION = process.env.NODE_ENV === 'production';
const STYLE_LOADER = PRODUCTION ? MiniCssExtractPlugin.loader : 'style-loader';

const PATH_ROOT = join(__dirname);
const PATH_DIST = join(PATH_ROOT, 'dist');
const PATH_SRC = join(PATH_ROOT, 'src');
const PATH_NODE_MODULES = join(PATH_ROOT, 'node_modules');
const PATH_INDEX = join(PATH_SRC,'index.html');

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  devServer: {
    disableHostCheck: true,
  },
  entry: [
    join(PATH_SRC, 'index.tsx'),
  ],
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom'
    },
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
    modules: [
      PATH_SRC,
      'node_modules'
    ]
  },
  module: {
    rules: [{
      test: /\.ts(x?)$/,
      exclude: /node_modules/,
      type: 'javascript/auto',
      use: [
        "babel-loader",
        "ts-loader"
      ]
    },
    {
      exclude: /node_modules/,
      loader: 'babel-loader',
      test: /\.js(x?)$/,
      type: 'javascript/auto',
    }, {
      test: /\.css$/,
      use: [
        STYLE_LOADER,
        {
          loader: 'css-loader',
          options: {
            sourceMap: true
          }
        }
      ],
      include: PATH_SRC
    }, {
      test: /\.css$/,
      use: [
        STYLE_LOADER,
        'css-loader?sourceMap'
      ],
      include: PATH_NODE_MODULES
    }]
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
        terserOptions: {
          keep_classnames: true,
          keep_fnames: true,
        },
      }),
      new OptimizeCssPlugin(),
    ],
    runtimeChunk: 'single',
  },
  output: {
    path: PATH_DIST,
    chunkFilename: 'static/js/chunks/[name].[chunkhash:7].js',
    filename: 'static/js/app.[hash:7].js',
    publicPath: '/'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: PATH_INDEX,
      minify: {
        collapseWhitespace: true,
        quoteCharacter: '\''
      }
    }),
    new WriteFilePlugin(),
  ],
  performance: {
    hints: false
  }
}
