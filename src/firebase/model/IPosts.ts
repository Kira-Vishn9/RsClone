import { DocumentData, DocumentReference, DocumentSnapshot } from 'firebase/firestore/lite';

interface IPosts {
    userID: string;
    text: string;
    fileName: string;
    fileURL: string;

    nickName?: string;

    likes?: DocumentReference;
    likesCount: number;
    likesUsers: string[];

    comments?: DocumentReference;
    commentsCount: number;

    createdAt?: Date;
    author: { fullname: string; nickName: string };
    time: number;
    postID: string;
}

export default IPosts;
