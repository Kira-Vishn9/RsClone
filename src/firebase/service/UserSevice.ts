import { collection, doc, getDoc, getDocs, getFirestore, setDoc, updateDoc } from 'firebase/firestore/lite';
import userState from '../../state/user.state';
import UserState from '../../state/UserState';
import app from '../config/config';
import IUser from '../model/IUser';

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
                nickName: result.nikName,
            };
            UserState.instance.Author = u;
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    // записать юзера
    public async setUser(id: string, user: IUser): Promise<void> {
        try {
            // const docRef = doc(this.data);
            const data = collection(this.db, 'Users');
            const docRef = doc(data, id);
            console.log('setUserID: ' + docRef.id);
            userState.id = docRef.id;
            UserState.instance.setUserID(docRef.id);
            const u = {
                fullname: user.name,
                nickName: user.nikName,
            };
            UserState.instance.Author = u;
            await setDoc(docRef, user);

            this.updateUserAvatar('./assets/image/user.png');
        } catch (error) {
            console.log(error);
        }
    }

    // Обновить данные юзера
    public async updateUserAvatar(urlImg: string): Promise<void> {
        const userID = UserState.instance.UserID;
        if (userID === null) return;
        // const user = await this.getUser(userID);
        const docRef = doc(this.data, userID);

        await updateDoc(docRef, {
            avatar: urlImg,
        });
    }
}

export default UserService;
