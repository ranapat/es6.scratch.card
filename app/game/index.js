import * as PIXI from 'pixi.js';

import * as config from '../config';

import state from './state';
import loop from './loop';
import debug from './debug';
import Card from './card';

let app;
let cards;

const items = Object.keys(config.items);

let replay;
let replayColorFilter;

const setup = () => {
  app = new PIXI.Application(config.application);

  const background = new PIXI.Sprite(PIXI.loader.resources.background.texture);
  app.stage.addChild(background);

  document.getElementById('root').appendChild(app.view);

  app.ticker.add(loop);
};

const placeButtons = () => {
  replay = new PIXI.Sprite(PIXI.loader.resources.replay.texture);
  app.stage.addChild(replay);
  replay.x = (config.application.width - replay.width) / 2;
  replay.y = config.application.height - replay.height - 15;

  replay.interactive = false;
  replay.buttonMode = true;
  replay.defaultCursor = 'pointer';

  replayColorFilter = new PIXI.filters.ColorMatrixFilter();
  replayColorFilter.brightness(0.5, false);
  replay.filters = [replayColorFilter];

  let played = false;

  replay.on('pointertap', data => {
    for (let i = 0; i < cards.length; ++i) {
      for (let j = 0; j < cards[i].length; ++j) {
        cards[i][j].enabled = false;
        cards[i][j].reset();

        replay.filters = [replayColorFilter];
        replay.interactive = false;
        played = false;
      }
    }

    populateCards();
  });

  state.emitter.on('play', () => {
    if (!played) {
      replay.filters = [];
      replay.interactive = true;

      played = true;
    }
  });
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
  placeButtons();
  placeCards();
  populateCards();

  debug(app);

  return app;
};

export default initialize;
