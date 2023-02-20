import { FieldValue } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore/lite';

interface INewMessage {
    messageID?: string;
    name: string;
    avatarURL: string;
    text: string;
    timestamp: FieldValue;
}

export default INewMessage;
