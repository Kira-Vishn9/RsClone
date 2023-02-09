import App from './app/app';
import './shared/style/main.scss';
import OpenImg from './profileOpenImg/OpenImg';

const app = new App();
app.init();
const open = new OpenImg();
document.querySelector('body')?.insertAdjacentHTML( 'afterbegin' , open.Overflow());