import path from 'path';

const defaultLoaders = [
  { loader: 'babel', test: /\.js$/, exclude: /(node_modules)/ },
  { test: /\.(jpe?g|png|gif|svg)(\?.*$|$)/i, loaders: ['url?limit=8192&name=public/images/[name].[ext]', 'img'] },
  {
    test: /\.js$/,
    include: path.resolve(__dirname, '../app/'),
    exclude: /node_modules/,
    loader: 'eslint-loader',
  }, {
    test: /\.js$/,
    include: path.resolve(__dirname, '../app/'),
    exclude: /node_modules/,
    loader: 'jscs-loader',
  },
  {
    test: /\.json$/,
    loader: 'json',
  },
];

export const production = [...defaultLoaders];

export const development = [...defaultLoaders];
