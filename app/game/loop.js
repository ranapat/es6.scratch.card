import state from './state';
import coin from './coin';

let prevDown = undefined;
let prevX = undefined;
let prevY = undefined;

let downXY = undefined;

let steps = 0;
let observed = undefined;
const trashhold = {
  x: 10,
  y: 10,
  steps: 25,
};

const percentage = () => {
  if (downXY) {
    const diffX = Math.abs(downXY.x - prevX);
    const diffY = Math.abs(downXY.y - prevY);
    if (diffY !== 0) {
      const diff = Math.min(1, diffX / diffY);
      coin.rotation = diff * 90 * Math.PI / 180;
    }
  }
};

const loop = delta => {
  if (prevDown !== state.down) {
    prevDown = state.down;

    if (!state.down) {
      downXY = undefined;
    }
  }

  percentage();

  if (prevX !== state.latest.x) {
    prevX = state.latest.x;
  }

  if (prevY !== state.latest.y) {
    prevY = state.latest.y;
  }

  if (
    downXY === undefined
      && prevX !== undefined
      && prevY !== undefined
  ) {
    downXY = {
      x: state.latest.x,
      y: state.latest.y,
    };
  }

  if (downXY) {
    if (observed === undefined) {
      observed = {
        x: downXY.x,
        y: downXY.y,
      };
    } else if (
      Math.abs(observed.x - downXY.x) < trashhold.x
        && Math.abs(observed.y - downXY.y) < trashhold.y
        && steps++ > trashhold.steps
    ) {
      downXY = {
        x: state.latest.x,
        y: state.latest.y,
      };
      observed = undefined;
      steps = 0;
    }
  } else {
    steps = 0;
  }
};

export default loop;
