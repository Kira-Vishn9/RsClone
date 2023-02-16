import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: 'AIzaSyAIEPMLcikfCiDXT9DAhdFvqsy3Av76re0',
    authDomain: 'clon-insta-4d81b.firebaseapp.com',
    databaseURL: 'https://clon-insta-4d81b-default-rtdb.firebaseio.com',
    projectId: 'clon-insta-4d81b',
    storageBucket: 'clon-insta-4d81b.appspot.com',
    messagingSenderId: '32448233635',
    appId: '1:32448233635:web:304c3f503ac8f0d4a5ff16',
};

// const firebaseConfig = {
//     apiKey: 'AIzaSyBUzYL3IZqUD3gKEkhoeQesm5m6fkitS9Y',
//     authDomain: 'rs-clone-insta.firebaseapp.com',
//     projectId: 'rs-clone-insta',
//     storageBucket: 'rs-clone-insta.appspot.com',
//     messagingSenderId: '238045707767',
//     appId: '1:238045707767:web:94f7fa1a43cf21a25502f2',
// };

const app = initializeApp(firebaseConfig);
export default app;
