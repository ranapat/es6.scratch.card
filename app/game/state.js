import { EventEmitter } from 'eventemitter3';

import * as config from '../config';

let down = config.ticket.autoScratch;
const latest = {
  x: undefined,
  y: undefined,
};
const global = {
  x: undefined,
  y: undefined,
};

const emitter = new EventEmitter();

export default {
  down, latest, global,
  emitter,
};
