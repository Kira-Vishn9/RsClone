import App from './app/app';
import Auth from './firebase/auth/Auth'; //<< Test
import IPosts from './firebase/model/IPosts'; //<< TEST
import IUser from './firebase/model/IUser';
import PostsService from './firebase/service/PostsService';
import './shared/style/main.scss';
import OpenImg from './profileOpenImg/OpenImg';

const app = new App();
app.init();
// const open = new OpenImg();
// document.querySelector('body')?.insertAdjacentHTML( 'afterbegin' , open.Overflow());
