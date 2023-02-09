import App from './app/app';
import Auth from './firebase/auth/Auth'; //<< Test
import IPosts from './firebase/model/IPosts'; //<< TEST
import IUser from './firebase/model/IUser';
import PostsService from './firebase/service/PostsService';
import './shared/style/main.scss';
import userState from './state/user.state'; //<< TEST

const app = new App();
app.init();

// test auth and create post

// const user: IUser = {
//     email: 'Nikolay@nik.com',
//     name: 'Nikolay',
//     nikName: 'Doonn',
//     password: 'password',
// };

// async function test(): Promise<void> {
//     Auth.instance.test = user;
//     await Auth.instance.signinUser(user.email, user.password);

//     const createPost: IPosts = {
//         userID: userState.id,
//         caption: 'Kek Lulz Bolde',
//     };

//     await PostsService.instance.setPosts(createPost);
// }

// test();
