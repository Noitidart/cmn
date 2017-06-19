/* global __dirname, require, module*/

const webpack = require('webpack');
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const path = require('path');
const env  = require('yargs').argv.env; // use --env with webpack 2

let libraryName = 'cmn';

let plugins = [], outputFile;

let rules = [
  {
    test: /(\.jsx|\.js)$/,
    loader: 'babel-loader',
    exclude: /(node_modules|bower_components)/
  },
  {
    test: /(\.jsx|\.js)$/,
    loader: 'eslint-loader',
    exclude: /node_modules/
  }
];

if (env === 'build') {
  // plugins.push(new UglifyJsPlugin({ minimize: true }));
  outputFile = libraryName + '.min.js';
  rules.unshift({
    test: /\.js$/,
    exclude: /node_modules/,
    loader: 'string-replace-loader?search=^.*?console\.[a-zA-Z].*?$&flags=gm&replace=',
    enforce: 'pre'
  });
} else {
  outputFile = libraryName + '.js';
}

const config = {
  entry: __dirname + '/src/index.js',
  devtool: 'source-map',
  output: {
    path: __dirname + '/lib',
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: rules
  },
  resolve: {
    modules: [path.resolve('./src'), 'node_modules'],
    extensions: ['.json', '.js']
  },
  plugins: plugins,
  externals: {
    qs: 'qs'
  }
};

module.exports = config;
