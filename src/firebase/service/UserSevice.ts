import { User } from 'firebase/auth';
import { collection, deleteDoc, doc, getDoc, getDocs, getFirestore, setDoc, updateDoc } from 'firebase/firestore/lite';
import userState from '../../state/user.state';
import UserState from '../../state/UserState';
import Auth from '../auth/Auth';
import app from '../config/config';
import ISubscription from '../model/ISubscription';
import IUser from '../model/IUser';
import PullPushImg from '../pull-push-img/PullPushImg';

class UserService {
    public static instance: UserService = new UserService();

    private db = getFirestore(app);
    private data = collection(this.db, 'Users');
    private constructor() {
        //
    }

    // Вернуть массив юзеров
    public async getAllUser(): Promise<IUser[] | null> {
        try {
            const collections = await getDocs(this.data);
            const data: IUser[] = collections.docs.map((doc) => doc.data()) as IUser[];
            return data;
        } catch (error: unknown) {
            console.error(error);
            return null;
        }
    }
    // Вернуть юзера или null
    public async getUser(id: string): Promise<IUser | null> {
        try {
            const docRef = doc(this.data, id);
            const docSnaphot = await getDoc(docRef);
            const result = docSnaphot.data() as IUser;
            const u = {
                fullname: result.name,
                nickName: result.nickName,
            };
            UserState.instance.Author = u;
            return result;
        } catch (error) {
            return null;
        }
    }

    // записать юзера
    public async setUser(id: string, user: IUser): Promise<void> {
        try {
            // const docRef = doc(this.data);
            const data = collection(this.db, 'Users');
            const docRef = doc(data, id);

            userState.id = docRef.id;
            UserState.instance.setUserID(docRef.id);
            const u = {
                fullname: user.name,
                nickName: user.nickName,
            };
            user.id = id;
            UserState.instance.Author = u;
            await setDoc(docRef, user);

            this.updateUserAvatar('./assets/image/user.png');
        } catch (error) {
            //
        }
    }

    // Обновить Аватар юзера
    public async updateUserAvatar(urlImg: string): Promise<void> {
        const userID = UserState.instance.UserID;
        if (userID === null) return;
        const docRef = doc(this.data, userID);

        await updateDoc(docRef, {
            avatar: urlImg,
        });
    }

    // Обновить данyые юзера
    public async updateUserData(data: IUser): Promise<void> {
        const userID = UserState.instance.UserID;
        if (userID === null) return;
        const docRef = doc(this.data, userID);
        await updateDoc(docRef, {
            name: data.name,
            nickName: data.nickName,
            email: data.email,
        });
        await Auth.instance.updateAuth(data.email, data.password);
    }
}

export default UserService;
