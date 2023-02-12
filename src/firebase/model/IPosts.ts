import { DocumentData, DocumentReference, DocumentSnapshot } from 'firebase/firestore/lite';

interface IPosts {
    userID: string;
    text: string;
    fileName: string;
    fileURL: string;

    nickName?: string;

    likes?: DocumentReference;
    likesCount: number;

    comments?: DocumentReference;
    commentsCount: number;

    createdAt?: Date;
    author: { fullname: string; nickName: string };
}

export default IPosts;
