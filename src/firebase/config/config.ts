import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyAbrSlPJqm6a0sdSm-f4Ds7MWrIpoyIF-s",
    authDomain: "clone-instagram-7c300.firebaseapp.com",
    databaseURL: "https://clone-instagram-7c300-default-rtdb.firebaseio.com",
    projectId: "clone-instagram-7c300",
    storageBucket: "clone-instagram-7c300.appspot.com",
    messagingSenderId: "572673925162",
    appId: "1:572673925162:web:c129d35a8ea48e1ce9a353"
  };

const app = initializeApp(firebaseConfig);
export default app;
