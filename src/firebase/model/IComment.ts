import { DocumentData, DocumentReference } from 'firebase/firestore/lite';

interface IComment {
    nickName: string;

    // post: DocumentReference;
    text: string;

    time: number;
}

export default IComment;
