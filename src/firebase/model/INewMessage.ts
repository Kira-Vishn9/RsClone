import { FieldValue } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore/lite';

interface INewMessage {
    messageID?: string;
    userID?: string;
    name: string;
    imgURL?: string;
    text: string;
    timestamp: FieldValue;
    isRead?: boolean;
}

export default INewMessage;
