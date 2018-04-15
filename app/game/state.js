import { EventEmitter } from 'eventemitter3';

let down = false;
const latest = {
  x: undefined,
  y: undefined,
};

const emitter = new EventEmitter();

export default {
  down, latest,
  emitter,
};
