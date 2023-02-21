import { getFirestore, collection, getDocs, doc, getDoc, setDoc, DocumentData } from 'firebase/firestore/lite';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    AuthErrorCodes,
    onAuthStateChanged,
    updateCurrentUser,
    User,
    updateProfile,
    updateEmail,
    Unsubscribe,
    NextOrObserver,
} from 'firebase/auth';
import app from '../config/config';
import IUser from '../model/IUser';
import { FirebaseError } from 'firebase/app';
import { LocalStorage } from '../../localStorage/localStorage';
import UserService from '../service/UserSevice';
import UserState from '../../state/UserState';

class Auth {
    public static instance = new Auth();

    private db = getFirestore(app);
    private data = collection(this.db, 'Users');
    private auth = getAuth();

    public get Auth() {
        return this.auth;
    }

    public get CurrentUser() {
        return this.auth.currentUser;
    }

    private constructor() {
        //
    }

    public async signupUser(user: IUser): Promise<string | undefined> {
        const email = user.email;
        const pass = user.password;
        try {
            const create = await createUserWithEmailAndPassword(this.auth, email, pass);
            UserService.instance.setUser(create.user.uid, user);
            await updateProfile(create.user, { displayName: user.nickName });
            await this.monitorAuthState();
            return '';
        } catch (error) {
            if (error instanceof FirebaseError) {
                return error.code;
            }
        }
    }

    public async signinUser(email: string, password: string) {
        try {
            const userAuth = await signInWithEmailAndPassword(this.auth, email, password);
            await this.monitorAuthState();
            return false;
        } catch (error) {
            if (error instanceof FirebaseError) {
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

    public async monitorAuthState() {
        onAuthStateChanged(this.auth, (user) => {
            if (user) {
                const userStore = LocalStorage.instance.getUser();
                userStore.id = user.uid;
                userStore.email = user.email || '';
                LocalStorage.instance.putUser(userStore.id, userStore.email);
            } else {
                //
            }
        });
    }

    public async updateAuth(email: string, password: string): Promise<void> {
        if (this.auth.currentUser === null) return;
        await updateEmail(this.auth.currentUser, email);
    }
}

export default Auth;
