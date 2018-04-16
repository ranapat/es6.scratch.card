import * as PIXI from 'pixi.js';

import * as config from '../config';

const preloader = (callback) => {
  const items = [];

  items.push({
    name: 'background',
    url: config.application.background,
  });
  items.push({
    name: 'frame',
    url: config.card.frame,
  });
  items.push({
    name: 'replay',
    url: config.buttons.replay,
  });
  items.push({
    name: 'gameover',
    url: config.popups.gameover,
  });
  for (let name in config.items) {
    items.push({
      name,
      url: config.items[name],
    });
  }

  PIXI.loader.add(items).load(callback);
};

export default preloader;
