import { DocumentData, DocumentReference } from 'firebase/firestore/lite';

interface IUser {
    id?: string;
    email: string;
    name: string;
    nickName: string;
    password: string;
    avatar: string;

    followers?: DocumentReference;
    followersCount?: number;

    subscriptions?: DocumentReference;
    subscriptionCount?: number;

    savedPosts?: DocumentReference;
    createAt?: Date;
}
//DocumentData
//DocumentReference

export default IUser;
