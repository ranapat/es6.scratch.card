import * as PIXI from 'pixi.js';

import * as config from '../config';

import loop from './loop';
import debug from './debug';
import Card from './card';

let app;
let cards;

const items = Object.keys(config.items);

const setup = () => {
  app = new PIXI.Application(config.application);

  const background = new PIXI.Sprite(PIXI.loader.resources.background.texture);
  app.stage.addChild(background);

  document.getElementById('root').appendChild(app.view);

  app.ticker.add(loop);
};

const placeCards = () => {
  cards = [];

  const background = new PIXI.Graphics();
  background.beginFill(config.ticket.background);
  background.drawRect(
    (
      config.application.width
        - config.ticket.horizontal * config.card.width
        - (config.ticket.horizontal - 1) * config.ticket.spacing
    ) / 2 - config.ticket.spacing,
    (
      config.application.height
        - config.ticket.vertical * config.card.height
        - (config.ticket.vertical - 1) * config.ticket.spacing
    ) / 2 - config.ticket.spacing,

    config.ticket.horizontal * (config.card.width + config.ticket.spacing) + config.ticket.spacing,
    config.ticket.vertical * (config.card.height + config.ticket.spacing) + config.ticket.spacing
  );
  background.endFill();
  app.stage.addChild(background);

  for (let i = 0; i < config.ticket.horizontal; ++i) {
    cards.push([]);

    for (let j = 0; j < config.ticket.vertical; ++j) {
      const card = new Card();
      card.add(
        app,
        i * (config.card.width + config.ticket.spacing)
          + (
            config.application.width
              - config.ticket.horizontal * config.card.width
              - (config.ticket.horizontal - 1) * config.ticket.spacing
          ) / 2,
        j * (config.card.height + config.ticket.spacing)
          + (
            config.application.height
              - config.ticket.vertical * config.card.height
              - (config.ticket.vertical - 1) * config.ticket.spacing
          ) / 2
      );

      cards[i].push(card);
    }
  }
};

const randomItem = () => {
  const max = items.length - 1;
  const min = 0;
  const rand = Math.floor(Math.random() * (max - min + 1)) + min;
  return items[rand];
};

const populateCards = () => {
  for (let i = 0; i < cards.length; ++i) {
    for (let j = 0; j < cards[i].length; ++j) {
      cards[i][j].enabled = true;
      cards[i][j].item = randomItem();
    }
  }
};

const initialize = () => {
  setup();
  placeCards();
  populateCards();

  debug(app);

  return app;
};

export default initialize;
