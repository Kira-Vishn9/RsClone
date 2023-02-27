import { FieldValue } from 'firebase/firestore';

interface IMessage {
    messageID?: string;
    userID?: string;
    name: string;
    imgURL?: string;
    text: string;
    timestamp: FieldValue;
    isRead?: boolean;
}

export default IMessage;
