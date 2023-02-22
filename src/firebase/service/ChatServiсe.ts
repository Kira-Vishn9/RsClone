import { FirebaseError } from 'firebase/app';
import {
    addDoc,
    collection,
    collectionGroup,
    CollectionReference,
    doc,
    getDocs,
    getFirestore,
    limit,
    onSnapshot,
    orderBy,
    query,
    Query,
    setDoc,
    Timestamp,
    serverTimestamp,
    DocumentData,
    DocumentReference,
} from 'firebase/firestore';
import EventBus from '../../app/event_bus/EventBus';
import UserState from '../../state/UserState';
import Auth from '../auth/Auth';
import app from '../config/config';
import IChatRoom from '../model/IChatRoom';
import IMessage from '../model/IMessage';
import INewMessage from '../model/INewMessage';

class ChatServiсe {
    public static instance: ChatServiсe = new ChatServiсe();
    // private database = getDatabase(app);
    private readonly database = getFirestore(app);
    private chatRooms = collection(this.database, 'ChatRooms');
    private pathChatsRoom = 'ChatRooms';
    private pathMessage = 'message';

    private constructor() {
        //
    }

    private roomID: string | null = null;
    public get RoomID() {
        return this.roomID;
    }

    //TODO Check function checkDubplicat Refactor
    public async createChatRoom(firstID: string, secondID: string): Promise<void> {
        try {
            const findDublicat = await this.checkDubplicat(firstID, secondID);

            if (findDublicat instanceof FirebaseError) return;

            if (findDublicat === true) return;

            const docRef = doc(this.chatRooms);
            this.roomID = docRef.id;
            const chatRoom: IChatRoom = {
                chatID: docRef.id,
                userID: firstID,
                recipientID: secondID,
            };
            await setDoc(docRef, chatRoom);
        } catch (error) {
            //
        }
    }

    public async getAllChatRoomBySelfUserID(id: string): Promise<IChatRoom[] | null> {
        try {
            const coll = collection(this.database, this.pathChatsRoom);
            const rooms = await getDocs(coll);
            const chatRooms = rooms.docs.map((room) => room.data());
            const chatRoomsTest = rooms.docs.map((room) => room.ref);
            this.loadMessage(chatRoomsTest);
            return chatRooms as IChatRoom[];
        } catch (error) {
            return null;
        }
    }

    public async getAllMessagesByRoomID(roomID: string): Promise<INewMessage[] | null> {
        try {
            const docRefRoom = doc(this.chatRooms, roomID);
            const messageCollection = collection(docRefRoom, this.pathMessage);
            const messageQuery = query(messageCollection, orderBy('timestamp', 'asc'));
            const docRefMessage = await getDocs(messageQuery);
            const messageArr = docRefMessage.docs.map((message) => message.data()) as INewMessage[];
            return messageArr;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    // TODO Решить проблему с subscription, unsubscription Refactor
    public async loadMessage(data: DocumentReference<DocumentData>[]) {
        data.forEach((ref) => {
            const messageCollection = collection(ref, this.pathMessage);
            const messageQuery = query(messageCollection, orderBy('timestamp', 'desc'), limit(1));
            const unSub = onSnapshot(messageQuery, (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === 'added') {
                        const data = change.doc.data() as INewMessage;
                        console.log(data);
                        EventBus.instance.emit(EventBus.instance.eventType.LOAD_MESSAGE, data); //<< Глобальный Event
                    }
                });
            });
        });
        // const docRoom = doc(data, this.roomID);
        // const coll = collection(docRoom, this.pathMessage);
    }

    public async saveMessage(roomid: string, messageText: string): Promise<void> {
        this.roomID = roomid;
        const user = UserState.instance.CurrentUser;
        if (user === null) return;

        if (user.displayName === null) return;
        const docRoom = doc(this.chatRooms, roomid);
        const messageCollection = collection(docRoom, 'message');
        const docRef = doc(messageCollection);
        // const message: INewMessage = {
        //     text: messageText,
        //     avatarURL: 's',
        //     name: user.displayName,
        //     messageID: docRef.id,
        //     timestamp: Timestamp.now(),
        // };
        const message: INewMessage = {
            userID: UserState.instance.CurrentUser?.uid,
            text: messageText,
            avatarURL: 's',
            name: user.displayName,
            timestamp: serverTimestamp(),
        };
        // await setDoc(docRef, message);
        await addDoc(messageCollection, message);
    }

    // public async loadMessage(cb?: (message: INewMessage) => void): Promise<void> {
    //     if (this.roomID === null) return;
    //     const docRoom = doc(this.chatRooms, this.roomID);
    //     const coll = collection(docRoom, this.pathMessage);
    //     const messageQuery = query(coll, orderBy('timestamp', 'desc'), limit(1));
    //     const tt = onSnapshot(messageQuery, (snapshot) => {
    //         snapshot.docChanges().forEach((change) => {
    //             // change.doc.data();
    //             // if (change.type === 'removed') {
    //             // if (change.type === 'added') {
    //             //deleteMessage(change.doc.id);
    //             // } else {
    //             // if (change.type === 'added') {
    //             var message = change.doc.data() as INewMessage;
    //
    //             if (cb !== undefined) {
    //                 cb(message);
    //             }
    //             // tt();
    //             // }
    //             //displayMessage(change.doc.id, message.timestamp, message.name,
    //             //message.text, message.profilePicUrl, message.imageUrl);
    //             // }
    //         });
    //     });
    // const sort = orderBy('timestamp', 'desc');
    // const qur = collectionGroup(this.database, coll).;
    // const recentMessagesQuery = query(qur, sort);
    // }

    // TODO wrong incorect check by duplicat Refactor
    private async checkDubplicat(id: string, secondID: string): Promise<boolean | FirebaseError> {
        try {
            const rooms = await this.getAllChatRoomBySelfUserID(id);
            const find = rooms?.find((room) => room.userID === id && room.recipientID === secondID);
            if (find === undefined) {
                return false;
            } else {
                return true;
            }
        } catch (error) {
            return error as FirebaseError;
        }
    }

    // << OLD
    // public push(arg: IMessage, callback: (data: DataSnapshot) => void) {
    //     const id = push(child(ref(this.database), this.message)).key;
    //     set(ref(this.database, `messages/${this.sortName('kira', arg.recipientName)}/` + id), {
    //         name: 'kira',
    //         message: arg.message,
    //     });

    //     const newMsg = ref(this.database, `messages/${this.sortName('kira', arg.recipientName)}/`);
    //     onChildAdded(newMsg, callback);
    // }

    // private sortName(name1: string, name2: string) {
    //     return [name1, name2].sort().join('');
    // }
}

export default ChatServiсe;
