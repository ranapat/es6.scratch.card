import path from 'path';

const defaultResolver = {
  extenstions: ['', '.js', '.jpg', '.png', '.svg'],
  modulesDirectory: ['node_modules'],
  root: [
    path.resolve(path.join(__dirname, '../app/')),
    path.resolve(path.join(__dirname, './shared')),
  ],
  alias: {
  },
};

export const production = defaultResolver;

export const development = defaultResolver;
