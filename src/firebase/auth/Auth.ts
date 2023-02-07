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
import userState from '../../state/user.state';

class Auth {
    public static instance = new Auth();

    private db = getFirestore(app);
    private data = collection(this.db, 'Users');
    private auth = getAuth();

    // Вернуть массив юзеров
    private async getAllUser(): Promise<IUser[] | boolean> {
        try {
            const collections = await getDocs(this.data);
            const data: IUser[] = collections.docs.map((doc) => doc.data()) as IUser[];
            return data;
        } catch (error: unknown) {
            console.error(error);
            return false;
        }
    }

    // Вернуть юзера или null
    private async getUser(email: string, password: string): Promise<IUser> {
        // const datasSet = collection(this.db, 'DatasSet');
        // const dataSnapshot = await getDocs(datasSet);
        // const dataSnapshot = await getDoc(datasSet.path);
        // const dataList = dataSnapshot.docs.map((doc) => doc.data());
        // console.log(dataList);
        // console.log(dataSnapshot)
        // const docRef = doc(this.data, 'xPEZiSFKJZpeMVHddnQS');
        // const docSnap = await getDoc(docRef);
        // docSnap.
        // const bb = docSnap.data();
        // const tt = await getDoc(bb);
        // console.log(docSnap.ref);
        const collections = await getDocs(this.data);

        const docData = collections.docs.map((doc) => doc.data());
        const getDoc1 = docData.filter((doc) => doc.email === email);
        const user = getDoc1[0] as IUser;
        // const user = getDoc1[0];
        // const posts = user.posts as DocumentData;
        // console.log(posts.id);
        return user;
        // const bebe = getDoc.map((doc) => doc.data())
        // console.log(getDoc.map((doc) => console.log(doc)));
        // const docRef = doc(this.data, 'Tod');

        // const docRef = doc(this.data, 'xPEZiSFKJZpeMVHddnQS');
        // const col = collection(this.db, 'Posts');
        // const docRef = doc(col, posts.id);
        // const docSnap = await getDoc(docRef);
        // console.log(docSnap.data());
        // const docSnap = await getDoc(docRef);
        // const snap = docSnap.data();
        // console.log(snap);
    }

    // записать юзера
    private async setUser(user: IUser): Promise<void> {
        const test = doc(this.data);
        await setDoc(test, user);
    }

    // Обновить данные юзера
    private async updateUser(): Promise<void> {
        //
    }

    public async signupUser(user: IUser): Promise<string | undefined> {
        const email = user.email;
        const pass = user.password;
        try {
            const create = await createUserWithEmailAndPassword(this.auth, email, pass);
            this.setUser(user);
            // const authUser = create.user;
            // console.log(authUser);
            // return user;
            return '';
        } catch (error) {
            if (error instanceof FirebaseError) {
                return error.code;
            }
        }
    }

    // public async signinUser(user: IUser): Promise<boolean | IUser> {
    //     const email = user.email;
    //     const pass = user.password;
    //     try {
    //         const create = await signInWithEmailAndPassword(this.auth, email, pass);
    //         const authUser = create.user;
    //         console.log(authUser);
    //         return user;
    //     } catch (error: unknown) {
    //         console.log(error);
    //         return false;
    //     }
    // }

    public async signinUser(email: string, password: string) {
        try {
            const userAuth = await signInWithEmailAndPassword(this.auth, email, password);
            console.log(userAuth.user);
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

    public async monitorAuthState() {
        onAuthStateChanged(this.auth, (user) => {
            if (user) {
                userState.id = user.uid;
                userState.email = user.email || '';
                console.log(userState);
            }
        });
    }
}
export default Auth;
