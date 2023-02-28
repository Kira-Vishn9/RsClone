import { FirebaseError } from 'firebase/app';
import { CollectionReference, DocumentChangeType, DocumentData, onSnapshot } from 'firebase/firestore';
import { collection, deleteDoc, doc, getDoc, getDocs, getFirestore, setDoc } from 'firebase/firestore';
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

    // eslint-disable-next-line prettier/prettier
    public async setSubscriptions(userID: string, sub: ISubscription, cb?: () => void): Promise<void> {
        try {
            // const userID = UserState.instance.UserID;
            if (userID === null) return;
            const docRef = doc(this.data, userID);
            const subCollection = collection(docRef, this.pathSubscriptions);
            const subUser = await UserService.instance.getUser(sub.userID);

            const find = await this.findSubscraptions(userID, sub.userID);
            // console.log(find);
            if (find instanceof FirebaseError) return;
            if (find !== null) {
                // console.log('Такой Документ Существует!!!!');
                return;
            }
            // console.log('aga');
            await this.checkForDuplicateSubscriptions(subCollection, async () => {
                if (subUser !== null && subUser.id !== undefined) {
                    const follower = await FollowersService.instance.setFollower(subUser.id, userID);
                }

                // console.log('aga2');

                const subDocRef = doc(subCollection);
                sub.id = subDocRef.id;
                // console.log('sub', sub);
                await setDoc(subDocRef, sub);
                if (cb !== undefined) {
                    cb();
                }
                // console.log('Записал в Подписчик');
            });
        } catch (error) {
            //
        }
    }

    // eslint-disable-next-line prettier/prettier
    private async checkForDuplicateSubscriptions(
        docRef: CollectionReference<DocumentData>,
        cb: () => void
    ): Promise<void> {
        // const tt = query(docRef);
        const eventSnapshot = onSnapshot(docRef, (snaphot) => {
            // if (snaphot.empty) {
            //     cb('added');
            //     eventSnapshot();
            //     return;
            // }

            snaphot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                    //
                }
            });

            cb();
            eventSnapshot();
        });
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
            return null;
        }
    }

    public async deleteSubscriptions(ownUserID: string, subID: string): Promise<void> {
        try {
            const docRef = doc(this.data, ownUserID);
            const subCollection = collection(docRef, this.pathSubscriptions);
            const subDocRef = doc(subCollection, subID);
            // console.log('deleteSub');
            const sub = await this.getSubscription(subID);
            // console.log('qqqqqqqqqqq', sub);
            if (sub === null) return;
            const getUser = await UserService.instance.getUser(sub.userID);
            // console.log('qqqqqqqqqqq');

            if (getUser === null || getUser.id === undefined) return;

            await FollowersService.instance.deleteFollower(getUser.id);

            await deleteDoc(subDocRef);
        } catch (error) {
            //
        }
    }

    public async findSubscraptions(ownUserID: string, subID: string): Promise<ISubscription | null | FirebaseError> {
        try {
            const docRef = doc(this.data, ownUserID);
            const subCollection = collection(docRef, this.pathSubscriptions);
            const sub = await getDocs(subCollection);
            const data = sub.docs.map((document) => document.data()) as ISubscription[];
            const findUser = data.find((sub) => sub.userID === subID);
            if (findUser) {
                return findUser;
            } else {
                return null;
            }
        } catch (error) {
            console.log(error);
            return error as FirebaseError;
        }
    }
}

export default SubscriptionsService;
