import { collection, deleteDoc, doc, getDocs, getFirestore, setDoc } from 'firebase/firestore/lite';
import app from '../config/config';
import IFollower from '../model/IFollower';
import UserService from './UserSevice';

class FollowersService {
    public static instance: FollowersService = new FollowersService();

    private readonly db = getFirestore(app);
    private readonly data = collection(this.db, 'Users');
    private readonly pathFollowers = 'Followers';

    public async setFollower(subID: string, ownID: string): Promise<void> {
        try {
            const getUser = await UserService.instance.getUser(ownID);
            if (getUser === null) return;

            const docRef = doc(this.data, subID);
            const subCollection = collection(docRef, this.pathFollowers);

            const subDocRef = doc(subCollection);
            // follower.id = subDocRef.id;
            const follower: IFollower = {
                fullname: getUser.name,
                nickName: getUser.nickName,
                userID: ownID,
                id: subDocRef.id,
                avatar: getUser.avatar === undefined ? '' : getUser.avatar,
            };
            await setDoc(subDocRef, follower);
        } catch (error) {
            //
        }
    }

    public async getFollowers(userID: string): Promise<IFollower[] | null> {
        try {
            // const userID = UserState.instance.UserID;
            if (userID === null) return null;
            const docRef = doc(this.data, userID);
            const subCollection = collection(docRef, this.pathFollowers);
            const subs = await getDocs(subCollection);

            const data: IFollower[] = subs.docs.map((sub) => sub.data()) as IFollower[];
            return data;
        } catch (error) {
            return null;
        }
    }

    public async deleteFollower(userID: string): Promise<void> {
        try {
            const docRef = doc(this.data, userID);
            const subCollection = collection(docRef, this.pathFollowers);
            const searchFollower = await this.getFollowers(userID);
            if (searchFollower === null) return;
            const follower = searchFollower[0];
            const subDocRef = doc(subCollection, follower.id);
            await deleteDoc(subDocRef);
        } catch (error) {
            //
        }
    }
}

export default FollowersService;
