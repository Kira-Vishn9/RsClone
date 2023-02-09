import { DocumentData, DocumentReference } from 'firebase/firestore/lite';

interface IComment {
    userID: DocumentReference;

    post: DocumentReference;
    text: string;

    createAt: Date;
}

export default IComment;
