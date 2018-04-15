import * as PIXI from 'pixi.js';

import { coin } from '../config';
const { width, height, stroke, probability, noise } = coin;

let shape = new PIXI.Graphics();
shape.beginFill(coin.color);
shape.lineStyle(stroke, coin.color);

shape.moveTo(0, 0);
shape.lineTo(0, height);
for (let i = noise; i < width - noise; i += stroke) {
  if (Math.random() > probability) {
    shape.moveTo(i, 0);
    shape.lineTo(i, height);
  }
}

shape.moveTo(width, 0);
shape.lineTo(width, height);

shape.endFill();

shape.pivot.x = width / 2;
shape.pivot.y = height / 2;

export default shape;
