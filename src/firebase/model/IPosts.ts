import { DocumentData, DocumentReference, DocumentSnapshot } from 'firebase/firestore/lite';
import IComment from './IComment';

interface IPosts {
    userID: string;
    text: string;
    fileName: string;
    fileURL: string;

    likes?: DocumentReference;
    likesCount: number;
    likesUsers: string[];

    comments?: IComment[];
    commentsCount: number;

    createdAt?: Date;
    author: { fullname: string; nickName: string };
    time: number;
    postID: string;
}

export default IPosts;
