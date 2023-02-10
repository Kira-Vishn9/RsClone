import { getFirestore, collection, getDocs, doc, getDoc, setDoc, DocumentData } from 'firebase/firestore/lite';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    AuthErrorCodes,
    onAuthStateChanged,
} from 'firebase/auth';
import app from '../config/config';
import IUser from '../model/IUser';
import { FirebaseError } from 'firebase/app';
import { LocalStorage } from '../../localStorage/localStorage';
import userState from '../../state/user.state';
import UserService from '../service/UserSevice';

class Auth {
    public static instance = new Auth();

    private db = getFirestore(app);
    private data = collection(this.db, 'Users');
    private auth = getAuth();

    public async signupUser(user: IUser): Promise<string | undefined> {
        const email = user.email;
        const pass = user.password;
        try {
            const create = await createUserWithEmailAndPassword(this.auth, email, pass);
            UserService.instance.setUser(create.user.uid, user);
            await this.monitorAuthState();
            return '';
        } catch (error) {
            if (error instanceof FirebaseError) {
                return error.code;
            }
        }
    }

    public test: IUser | null = null;
    public async signinUser(email: string, password: string) {
        try {
            const userAuth = await signInWithEmailAndPassword(this.auth, email, password);
            console.log(userAuth.user);
            await this.monitorAuthState();
            return false;
        } catch (error) {
            if (error instanceof FirebaseError) {
                console.log(error.code);
                if (error.code === AuthErrorCodes.INVALID_EMAIL) {
                    return 'Wrong email. Try again.';
                } else if (error.code === AuthErrorCodes.INVALID_PASSWORD) {
                    return 'Wrong password. Try again.';
                } else {
                    return 'User not found';
                }
            }
        }
    }

    private async monitorAuthState() {
        onAuthStateChanged(this.auth, (user) => {
            if (user) {
                const userStore = LocalStorage.instance.getUser();
                userStore.id = user.uid;
                userStore.email = user.email || '';
                LocalStorage.instance.putUser(userStore.id, userStore.email);
                console.log(userStore);
            }
        });
    }
}

export default Auth;
