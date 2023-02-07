import { DocumentData, DocumentReference } from 'firebase/firestore/lite';

interface IPosts {
    userID?: string;
    caption: string;
    tags?: string;
    files?: string;

    likes?: DocumentReference;
    likesCount?: number;
    comments?: DocumentReference;
    commentsCount?: number;

    createdAt?: Date;
}

export default IPosts;
