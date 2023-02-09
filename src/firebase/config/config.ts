import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: 'AIzaSyBUzYL3IZqUD3gKEkhoeQesm5m6fkitS9Y',
    authDomain: 'rs-clone-insta.firebaseapp.com',
    projectId: 'rs-clone-insta',
    storageBucket: 'rs-clone-insta.appspot.com',
    messagingSenderId: '238045707767',
    appId: '1:238045707767:web:94f7fa1a43cf21a25502f2',
};

const app = initializeApp(firebaseConfig);
export default app;
