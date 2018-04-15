import path from 'path';

import { production as plugins } from './webpack/plugins.babel';
import { production as loaders } from './webpack/loaders.babel';
import { production as preloaders } from './webpack/preloaders.babel';
import { production as resolve } from './webpack/resolve.babel';

module.exports = {
  entry: {
    app: path.resolve(path.join(__dirname, 'app/index.js')),
    vendor: [
      'classnames',
      'lodash',
    ],
  },
  output: {
    path: path.resolve(path.join(__dirname, '/build/')),
    publicPath: '/',
    filename: 'test-output-[name]-[hash].js',
  },
  devtool: 'source-map',
  module: {
    preloaders,
    loaders,
  },
  resolve,
  plugins,
};
