import App from './app/app';
import Auth from './firebase/auth/Auth'; //<< Test
import IPosts from './firebase/model/IPosts'; //<< TEST
import IUser from './firebase/model/IUser';
import PostsService from './firebase/service/PostsService';
import './shared/style/main.scss';
import userState from './state/user.state'; //<< TEST

const app = new App();
app.init();
