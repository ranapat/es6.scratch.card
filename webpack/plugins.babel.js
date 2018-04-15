import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import FaviconsWebpackPlugin from 'favicons-webpack-plugin';
import WebpackNotifierPlugin from 'webpack-notifier';

import config from '../config';

function createSharedPlugins(environment) {
  return [
    new webpack.BannerPlugin('Some Test'),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(environment),
      },
    }),
  ];
}

function createHTMLPlugins(opts) {
  return [
    new HtmlWebpackPlugin({
      title: opts.htmlTitle,
      template: path.resolve(path.join(__dirname, '../app/index.tmpl.html')),
    }),
    new FaviconsWebpackPlugin(path.resolve(path.join(__dirname, '../shared/images/logos/favicon.png'))),
  ];
}

export const production = [
  ...createSharedPlugins('production'),
  new webpack.optimize.DedupePlugin(),
  new webpack.optimize.UglifyJsPlugin({
    output: { comments: false },
    compress: { warnings: false, screw_ie8: true },
    drop_console: true,
  }),
  ...createHTMLPlugins({ htmlTitle: 'Some Test' }),
  new webpack.optimize.CommonsChunkPlugin(
    'vendor',
    'custom.canvas.game-[name]-[hash].js',
  ),
];

export const development = [
  ...createSharedPlugins('development'),
  ...createHTMLPlugins({ htmlTitle: 'DEV::Some Test' }),
  new webpack.HotModuleReplacementPlugin(),
  new WebpackNotifierPlugin({
    title: 'Custom Game Canvas DEV',
    icon: path.resolve(__dirname, '../shared/images/logos/favicon.png'),
    contentIcon: path.resolve(__dirname, '../shared/images/logos/favicon.png'),
    sound: 'Glass',
  }),
];
