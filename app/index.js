import preloader from './preloader';
import game from './game';

preloader(() => {
  document.getElementById('loading').style.display = 'none';
  game();
});
