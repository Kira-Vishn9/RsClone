import { DocumentData } from 'firebase/firestore/lite';

interface IUser {
    email: string;
    name: string;
    surname: string;
    nikName: string;
    password: string;
    followers?: DocumentData;
    followersCount?: number;
    follower?: DocumentData;
    followerCount?: number;
    posts?: DocumentData;
}

interface IFollower {
    //
}

export default IUser;
