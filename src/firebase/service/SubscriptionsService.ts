import { collection, deleteDoc, doc, getDoc, getDocs, getFirestore, setDoc } from 'firebase/firestore/lite';
import UserState from '../../state/UserState';
import app from '../config/config';
import ISubscription from '../model/ISubscription';
import FollowersService from './FollowersService';
import UserService from './UserSevice';

class SubscriptionsService {
    public static instance: SubscriptionsService = new SubscriptionsService();

    private readonly db = getFirestore(app);
    private readonly data = collection(this.db, 'Users');
    private readonly pathSubscriptions = 'Subscriptions';

    public async setSubscriptions(userID: string, sub: ISubscription): Promise<void> {
        try {
            // const userID = UserState.instance.UserID;
            if (userID === null) return;
            const docRef = doc(this.data, userID);
            const subCollection = collection(docRef, this.pathSubscriptions);
            const subUser = await UserService.instance.getUser(sub.userID);
            if (subUser !== null && subUser.id !== undefined) {
                const follower = await FollowersService.instance.setFollower(subUser.id, userID);
            }
            const subDocRef = doc(subCollection);
            sub.id = subDocRef.id;
            await setDoc(subDocRef, sub);
        } catch (error) {
            console.log(error);
        }
    }

    public async getSubscriptions(userID: string): Promise<ISubscription[] | null> {
        try {
            // const userID = UserState.instance.UserID;
            if (userID === null) return null;
            const docRef = doc(this.data, userID);
            const subCollection = collection(docRef, this.pathSubscriptions);
            const subs = await getDocs(subCollection);

            const data: ISubscription[] = subs.docs.map((sub) => sub.data()) as ISubscription[];
            return data;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    public async getSubscription(subID: string): Promise<ISubscription | null> {
        try {
            const userID = UserState.instance.UserID;
            if (userID === null) return null;
            const docRef = doc(this.data, userID);
            const subCollection = collection(docRef, this.pathSubscriptions);
            const subDocRef = doc(subCollection, subID);
            const sub = await getDoc(subDocRef);
            return sub.data() as ISubscription;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    public async deleteSubscriptions(ownUserID: string, subID: string): Promise<void> {
        try {
            const docRef = doc(this.data, ownUserID);
            const subCollection = collection(docRef, this.pathSubscriptions);
            const subDocRef = doc(subCollection, subID);

            const sub = await this.getSubscription(subID);
            if (sub === null) return;
            const getUser = await UserService.instance.getUser(sub.userID);
            if (getUser === null || getUser.id === undefined) return;

            await FollowersService.instance.deleteFollower(getUser.id);

            await deleteDoc(subDocRef);
        } catch (error) {
            console.log(error);
        }
    }
}

export default SubscriptionsService;
