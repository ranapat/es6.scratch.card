import MobileDetect from 'mobile-detect';
const md = new MobileDetect(window.navigator.userAgent);

export default {
  horizontal: 3,
  vertical: 3,
  spacing: 5,
  background: 0xd05d2d,
  revealAllAfter: 0.6,
  revealSingleAfter: 0.6,
  keepSingleBelow: 0.45,
  autoScratch: true && !md.mobile(),
};
