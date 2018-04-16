import * as config from '../config';

import coin from './coin';

const debug = app => {
  var style = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 15,
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
  var richText = new PIXI.Text('Random coin pattern', style);
  richText.x = 10;
  richText.y = 10;
  app.stage.addChild(richText);

  const background = new PIXI.Graphics();
  background.beginFill(0x0);
  background.drawRect(
    15, 35,
    config.coin.width + 10,
    config.coin.height + 10
  );
  background.endFill();
  app.stage.addChild(background);

  const shapeTexture = coin.generateCanvasTexture(PIXI.settings.SCALE_MODE);

  const debugCoin = new PIXI.Sprite(shapeTexture);
  debugCoin.x = 20;
  debugCoin.y = 40;
  app.stage.addChild(debugCoin);

  var richText = new PIXI.Text(config.ticket.autoScratch ? 'Move and unscratch' : 'Press and unscratch', style);
  richText.x = (config.application.width - richText.width) / 2;
  richText.y = (config.application.height - config.ticket.vertical * config.card.height) / 2 - 2 * richText.height;
  app.stage.addChild(richText);
};

export default debug;
