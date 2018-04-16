import * as PIXI from 'pixi.js';
import { TweenLite } from 'greensock';

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

let over = false;
let monitorRevealProgressIndex = 0;

let gameoverpopup;

const sprites = new PIXI.particles.ParticleContainer(config.particles.max, config.particles.options);

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
    over = false;

    if (gameoverpopup && gameoverpopup.parent) {
      gameoverpopup.parent.removeChild(gameoverpopup);
    }
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

const monitorProgress = () => {
  state.emitter.on('play', () => {
    if (over) {
      return;
    }

    if (++monitorRevealProgressIndex < config.optimizations.checkForCardRevealEveryNFrame) {
      return;
    } else {
      monitorRevealProgressIndex = 0;
    }

    let sum = 0;
    let total = 0;
    let blank = 0;

    for (let i = 0; i < cards.length; ++i) {
      for (let j = 0; j < cards[i].length; ++j) {
        const card = cards[i][j];
        const reveal = card.reveal;
        sum += reveal;
        ++total;

        if (reveal > config.ticket.revealSingleAfter) {
          card.scratch();
        } else if (reveal < config.ticket.keepSingleBelow) {
          ++blank;
        }
      }
    }

    const diff = sum / total;

    if (blank === 0 && diff > config.ticket.revealAllAfter) {
      over = true;

      gameover(won());

      for (let i = 0; i < cards.length; ++i) {
        for (let j = 0; j < cards[i].length; ++j) {
          cards[i][j].enabled = false;
          cards[i][j].scratch();
        }
      }
    }
  });
};

const particles = () => {
  app.stage.addChild(sprites);

  state.emitter.on('play', () => {
    if (over) {
      return;
    }

    const dust = new PIXI.Sprite(PIXI.loader.resources.star.texture);
    sprites.addChild(dust);

    dust.position.x = state.global.x + Math.random() * 25 * (Math.random() > .5 ? 1 : -1);
    dust.position.y = state.global.y + Math.random() * 25 * (Math.random() > .5 ? 1 : -1);

    TweenLite.to(dust.position, .15, {
      x: state.global.x + Math.random() * 100,
      y: state.global.y + Math.random() * 100,
    });
    TweenLite.to(dust, .15, {
      alpha: 0,
      rotation: Math.random(),
      onComplete: () => {
        sprites.removeChild(dust);
      },
    });

  });
};

const won = () => {
  let combinations = {};
  for (let i = 0; i < cards.length; ++i) {
    for (let j = 0; j < cards[i].length; ++j) {
      if (!combinations[cards[i][j].item]) {
        combinations[cards[i][j].item] = 1;
      } else {
        ++combinations[cards[i][j].item];
      }
    }
  }

  let biggest;
  let count = 0;
  for (let key in combinations) {
    if (combinations[key] > count) {
      count = combinations[key];
      biggest = key;
    }
  }

  if (count >= 3) {
    return {
      biggest,
      count,
    };
  } else {
    return undefined;
  }

};

const gameover = (won) => {
  var style = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 25,
    fontStyle: 'italic',
    fontWeight: 'bold',
    fill: ['#ffffff', '#00ffff'],
    stroke: '#4a1850',
    strokeThickness: 5,
    dropShadow: true,
    dropShadowColor: '#000000',
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
    wordWrap: true,
    wordWrapWidth: 440,
  });

  if (!gameoverpopup) {
    gameoverpopup = new PIXI.Sprite(PIXI.loader.resources.gameover.texture);

    gameoverpopup.x = (config.application.width) / 2;
    gameoverpopup.y = (config.application.height) / 2;
    gameoverpopup.pivot.x = gameoverpopup.width / 2;
    gameoverpopup.pivot.y = gameoverpopup.height / 2;

    var richText1 = new PIXI.Text('Game Over', style);
    richText1.x = (gameoverpopup.width - richText1.width) / 2;
    richText1.y = (gameoverpopup.height - richText1.height) / 2 - 50;
    gameoverpopup.addChild(richText1);
  }

  if (gameoverpopup.children.length === 2) {
    gameoverpopup.removeChildAt(1);
  }

  var richText2 = new PIXI.Text(won ? `you won ${won.count} ${won.biggest}` : 'you lost', style);
  richText2.x = (gameoverpopup.width - richText2.width) / 2;
  richText2.y = (gameoverpopup.height - richText2.height) / 2;
  gameoverpopup.addChild(richText2);

  app.stage.addChild(gameoverpopup);

  gameoverpopup.alpha = 0;
  TweenLite.to(gameoverpopup, 2, {
    delay: 2,
    alpha: 1,
  });

};

const initialize = () => {
  setup();
  placeButtons();
  placeCards();
  populateCards();

  won();

  monitorProgress();
  particles();

  debug(app);

  return app;
};

export default initialize;
