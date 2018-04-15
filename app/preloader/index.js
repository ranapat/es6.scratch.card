import * as PIXI from 'pixi.js';

import * as config from '../config';

const preloader = (callback) => {
  PIXI.loader.add([
    {
      name: 'background',
      url: config.application.background,
    },
    {
      name: 'frame',
      url: config.card.frame,
    },
    {
      name: 'pooh',
      url: config.items.pooh,
    },
    {
      name: 'pooh_and_tiger',
      url: config.items.pooh_and_tiger,
    },
    {
      name: 'pooh_honey',
      url: config.items.pooh_honey,
    },
    {
      name: 'tiger',
      url: config.items.tiger,
    },
    {
      name: 'yori',
      url: config.items.yori,
    },
    {
      name: 'piglet',
      url: config.items.piglet,
    },
  ]).load(callback);
};

export default preloader;
