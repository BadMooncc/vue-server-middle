const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const webpackBaseConfig = require('./webpack.base.conf');

module.exports = merge(webpackBaseConfig, {
  entry: {
    app: path.resolve(__dirname, '../src/main.js')
  },
  output: {
    path: path.resolve(__dirname, '../dist/'),
    publicPath: '/dist/',
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].chunk.js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'develop')
    }),
    new webpack.ProvidePlugin({
      moment: 'moment'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChuannks(module) {
        return (module.resource && /\.js$/.test(module.resource) &&
          module.resource.indexOf(path.join(__dirname, '../node_modules')) === 0
        );
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({ name: 'mainfest', chunks: ['vendor'] }),
    new HtmlWebpackPlugin({
      inject: true,
      filename: path.join(__dirname, '../dist/index.html'),
      template: path.join(__dirname, '../index.html')
    }),
    new FriendlyErrorsPlugin()
  ]
});
