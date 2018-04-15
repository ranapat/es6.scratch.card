import path from 'path';

import { development as plugins } from './webpack/plugins.babel';
import { development as loaders } from './webpack/loaders.babel';
import { development as preloaders } from './webpack/preloaders.babel';
import { development as resolve } from './webpack/resolve.babel';
import eslint from './webpack/eslint.babel';

import { webpack } from './config';

module.exports = {
  entry: [
    `webpack-dev-server/client?http://${webpack.devServer.host}:${webpack.devServer.port}`,
    'webpack/hot/dev-server',
    path.resolve(path.join(__dirname, 'app/index.js')),
  ],
  output: {
    path: path.resolve(path.join(__dirname, '/build/')),
    filename: 'test-output-[name]-[hash].js',
    sourceMapFilename: 'test-output-[name]-[hash].map',
    publicPath: '/',
  },
  devtool: 'inline-source-map',
  module: {
    preloaders,
    loaders,
  },
  resolve,
  plugins,
  eslint,
  devServer: {
    historyApiFallback: true,
    host: webpack.devServer.host,
    port: webpack.devServer.port,
  },
};
