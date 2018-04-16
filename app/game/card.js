import * as PIXI from 'pixi.js';

import { card, ticket } from '../config';

import coin from './coin';
import state from './state';

class Card {
  constructor() {
    this.covered = undefined;
    this.uncovered = undefined;
    this.uncoveredTexture = undefined;
    this.uncoveredBackground = undefined;
    this.uncoveredIcon = undefined;
    this.texture = undefined;

    this._app = undefined;
    this._down = false;

    this._item = undefined;
    this._unscratched = false;

    this._initialize();
  }

  _initialize() {
    const { width, height, covered, uncovered } = card;

    this.covered = new PIXI.Graphics();
    this.covered.beginFill(covered);
    this.covered.drawRect(0, 0, width, height);
    this.covered.endFill();

    this.uncoveredBackground = new PIXI.Sprite(PIXI.loader.resources.frame.texture);
    this.uncoveredIcon = undefined;

    this.uncoveredTexture = PIXI.RenderTexture.create(width, height);

    this.uncovered = new PIXI.Sprite(this.uncoveredTexture);

    this.texture = PIXI.RenderTexture.create(width, height);

    this.mask = new PIXI.Sprite(this.texture);

    this.uncovered.mask = this.mask;

    this._handleEvents();
  }

  set enabled(value) {
    this.covered.interactive = value;
  }

  get enabled() {
    return this.covered.interactive;
  }

  set item(value) {
    this._item = value;

    const { width, height } = card;

    if (PIXI.loader.resources[value]) {
      this.uncoveredIcon = new PIXI.Sprite(PIXI.loader.resources[value].texture);
      this.uncoveredIcon.x = (this.uncoveredBackground.width - this.uncoveredIcon.width) / 2;
      this.uncoveredIcon.y = (this.uncoveredBackground.height - this.uncoveredIcon.height) / 2;
    }

    this._generateBackground();
  }

  get item() {
    return this._item;
  }

  get reveal() {
    const pixels = this._app.renderer.extract.pixels(this.texture);
    let count = 0;
    for (let pixel of pixels) {
      if (pixel !== 0) {
        ++count;
      }
    }

    return count / pixels.length;
  }

  scratch(i = 0, j = 0, offsetI = 3, offsetJ = 3) {
    if (this._unscratched) {
      return;
    }

    const { width, height, scratchInterval } = card;

    this._trail({
      x: i,
      y: j,
    });

    // TODO: fix it without timers
    // this shall attach to the game timer and dequeue
    // but I'm too tired now, sorry...
    if (i >= 0 && i < width) {
      setTimeout(() => {
        this.scratch(i + offsetI, j + offsetJ, offsetI, offsetJ);
      }, scratchInterval);
    } else if (i >= width && offsetI === 3 && offsetJ === 3) {
      setTimeout(() => {
        this.scratch(width - 1, 0, -3, 3);
      }, scratchInterval);
    } else {
      this._unscratched = true;
      state.emitter.emit('play');
    }
  }

  reset() {
    coin.position.x = -100;
    coin.position.y = -100;
    this._app.renderer.render(coin, this.texture, true, null, false);

    this._unscratched = false;
  }

  _generateBackground() {
    this._app.renderer.render(this.uncoveredBackground, this.uncoveredTexture, false, null, false);
    if (this.uncoveredIcon) {
      this._app.renderer.render(this.uncoveredIcon, this.uncoveredTexture, false, null, false);
    }
  }

  _handleEvents() {
    if (!ticket.autoScratch) {
      this.covered.on('pointerdown', data => {
        state.down = true;
      });
      this.covered.on('pointerup', data => {
        state.down = false;
      });
      this.covered.on('pointerupoutside', data => {
        state.down = false;
      });
    }

    this.covered.on('pointermove', data => {
      if (data.currentTarget === this.covered && this._app && state.down) {
        const coordinates = data.data.getLocalPosition(this.mask);

        this._trail(coordinates);

        state.latest.x = coordinates.x;
        state.latest.y = coordinates.y;

        state.emitter.emit('play');
      }
    });
  }

  _trail(coordinates) {
    coin.position.copy(coordinates);
    this._app.renderer.render(coin, this.texture, false, null, false);
  }

  add(app, x, y) {
    this._app = app;
    const stage = app.stage;

    this.covered.x = x;
    this.covered.y = y;
    stage.addChild(this.covered);

    this.uncovered.x = x;
    this.uncovered.y = y;
    stage.addChild(this.uncovered);

    this.mask.x = x;
    this.mask.y = y;
    stage.addChild(this.mask);

    this._generateBackground();
  }
}

export default Card;
