import { DocumentData, DocumentReference } from 'firebase/firestore/lite';

interface IUser {
    email: string;
    name: string;
    nikName: string;
    password: string;
    avatar: string;

    bio?: string; // << Зачем Хороший Вопрос ?
    website?: string; // << Зачем Хороший Вопрос ?

    followers?: DocumentReference;
    followersCount?: number;

    following?: DocumentReference;
    followingCount?: number;

    savedPosts?: DocumentReference;
    createAt?: Date;
}
//DocumentData
//DocumentReference

export default IUser;
