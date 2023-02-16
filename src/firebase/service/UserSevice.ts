import { User } from 'firebase/auth';
import { collection, deleteDoc, doc, getDoc, getDocs, getFirestore, setDoc, updateDoc } from 'firebase/firestore/lite';
import userState from '../../state/user.state';
import UserState from '../../state/UserState';
import Auth from '../auth/Auth';
import app from '../config/config';
import ISubscription from '../model/ISubscription';
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
                nickName: result.nickName,
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
                nickName: user.nickName,
            };
            user.id = id;
            UserState.instance.Author = u;
            await setDoc(docRef, user);
        } catch (error) {
            console.log(error);
        }
    }

    // Обновить Аватар юзера
    public async updateUserAvatar(urlImg: string): Promise<void> {
        const userID = UserState.instance.UserID;
        if (userID === null) return;
        // const user = await this.getUser(userID);
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

    // Подписка и Followers
    // flag: boolean плохое решения, щас он отвечает за изменения местами фоловера // TODO Refactoring
    // на кого подписался у того появился фоловер и наобороти
    public async setSubscriptions(userID: string, sub: ISubscription, flag: boolean = true): Promise<void> {
        try {
            // const userID = UserState.instance.UserID;
            if (userID === null) return;
            const docRef = doc(this.data, userID);
            const subCollection = collection(docRef, 'Subscriptions');

            const subDocRef = doc(subCollection);
            sub.id = subDocRef.id;
            await setDoc(subDocRef, sub);

            const usID = UserState.instance.UserID;
            const anotherID = UserState.instance.AnotherUserID;
            if (usID !== null && anotherID !== null) {
                if (flag) {
                    await this.setFollower(usID, anotherID);
                } else {
                    await this.setFollower(anotherID, usID);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    public async getSubscriptions(userID: string): Promise<ISubscription[] | null> {
        try {
            // const userID = UserState.instance.UserID;
            if (userID === null) return null;
            const docRef = doc(this.data, userID);
            const subCollection = collection(docRef, 'Subscriptions');
            const subs = await getDocs(subCollection);

            const data: ISubscription[] = subs.docs.map((sub) => sub.data()) as ISubscription[];
            return data;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    public async deleteSubscriptions(subID: string): Promise<void> {
        try {
            const userID = UserState.instance.UserID;
            if (userID === null) return;
            const docRef = doc(this.data, userID);
            const subCollection = collection(docRef, 'Subscriptions');
            const subDocRef = doc(subCollection, subID);
            await deleteDoc(subDocRef);
        } catch (error) {
            console.log(error);
        }
    }

    // followers
    private async setFollower(userSubID: string, selfUserID: string): Promise<void> {
        try {
            // const userID = UserState.instance.AnotherUserID;
            const userID = userSubID;
            // const uID = UserState.instance.UserID;
            const uID = selfUserID;
            if (userID === null || uID === null) return;
            const getUser = await this.getUser(uID);
            if (getUser === null) return;

            const docRef = doc(this.data, userID);
            const subCollection = collection(docRef, 'Followers');

            const subDocRef = doc(subCollection);
            // follower.id = subDocRef.id;
            const follower: ISubscription = {
                fullname: getUser.name,
                nickName: getUser.nickName,
                userID: uID,
                id: subDocRef.id,
                avatar: getUser.avatar === undefined ? '' : getUser.avatar,
            };
            await setDoc(subDocRef, follower);
        } catch (error) {
            console.log(error);
        }
    }

    public async getFollowers(userID: string): Promise<ISubscription[] | null> {
        try {
            // const userID = UserState.instance.UserID;
            if (userID === null) return null;
            const docRef = doc(this.data, userID);
            const subCollection = collection(docRef, 'Followers');
            const subs = await getDocs(subCollection);

            const data: ISubscription[] = subs.docs.map((sub) => sub.data()) as ISubscription[];
            return data;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    // << END Подписка и Followers
}

export default UserService;
