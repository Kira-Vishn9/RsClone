import { FirebaseError } from 'firebase/app';
import { Unsubscribe } from 'firebase/auth';
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
    updateDoc,
} from 'firebase/firestore';
import EventBus from '../../app/event_bus/EventBus';
import EventType from '../../app/types/EventType';
import UserState from '../../state/UserState';
import Auth from '../auth/Auth';
import app from '../config/config';
import IChatRoom from '../model/IChatRoom';
import IMessage from '../model/IMessage';
import INewMessage from '../model/INewMessage';

type Notify = {
    roomID: string;
    countMessage: number;
};

type ReciveRoom = (room: IChatRoom) => void;

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
            const findDublicat = await this.findDublicate(firstID, secondID);
            if (findDublicat instanceof FirebaseError) return;

            if (findDublicat) {
                console.log('Такая Комната Чата Существует!!!');
                return;
            }
            console.log('Такой Комнаты НЕМА!!!');

            const docRef = doc(this.chatRooms);
            this.roomID = docRef.id;
            const chatRoom: IChatRoom = {
                chatID: docRef.id,
                userID: firstID,
                recipientID: secondID,
            };
            await setDoc(docRef, chatRoom);
            this.eventSnapShot(docRef);
        } catch (error) {
            console.log(error);
        }
    }

    public eventSnapShot(data: DocumentReference<DocumentData>): void {
        const event = onSnapshot(data, (snaphot) => {
            console.log(snaphot.data());
            console.log('ahahah');
            const chatRoom = snaphot.data() as IChatRoom;

            if (this.recieveEventGetRoom !== null) this.recieveEventGetRoom(chatRoom);
            event();
        });
    }

    public recieveEventGetRoom: ReciveRoom | null = null;

    public async getAllChatRoomBySelfUserID(id: string): Promise<IChatRoom[] | null> {
        try {
            const coll = collection(this.database, this.pathChatsRoom);
            const rooms = await getDocs(coll);
            const chatRooms = rooms.docs.map((room) => room.data()) as IChatRoom[];
            const filterChatRooms = chatRooms.filter((room) => room.userID === id || room.recipientID === id);

            const filter = rooms.docs.filter((room) => room.data().userID === id || room.data().recipientID === id);
            filter.forEach((t) => {
                console.log('test::', t.ref);

                const messageCollection = collection(t.ref, 'message');

                this.loadMessage(messageCollection);
            });
            return filterChatRooms;
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
    private eventLoadMessage: Unsubscribe | null = null;
    public async loadMessage(data: CollectionReference<DocumentData>) {
        // console.log('message::<<', 'aga');

        // if (this.eventLoadMessage !== null) this.eventLoadMessage();
        let test = 0;
        // data.forEach((ref) => {
        // const messageCollection = collection(ref, this.pathMessage);
        const messageQuery = query(data, orderBy('timestamp', 'desc'), limit(1));
        this.eventLoadMessage = onSnapshot(messageQuery, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                    const data = change.doc.data() as INewMessage;
                    test += 1;
                    console.log('LOAD__MESSAGE::', data);
                    EventBus.instance.emit(EventBus.instance.eventType.LOAD_MESSAGE, data); //<< Глобальный Event
                    // unSub();
                }
            });
            console.log('TEST:: <<', test);
            // unSub();
        });
        // unSub();
        // });
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
            messageID: docRef.id,
            userID: UserState.instance.CurrentUser?.uid,
            text: messageText,
            name: user.displayName,
            isRead: false,
            timestamp: serverTimestamp(),
        };
        await setDoc(docRef, message);
        // await addDoc(messageCollection, message);
        // this.loadMessage(messageCollection);
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

    private async findDublicate(id: string, secondID: string): Promise<IChatRoom | null | FirebaseError> {
        try {
            const rooms = await this.getAllChatRoomBySelfUserID(id);
            const find = rooms?.find((room) => {
                if (room.userID === id || room.recipientID === secondID) {
                    if (room.userID === secondID || room.recipientID === id) {
                        return true;
                    }
                    return true;
                } //else if (room.userID === secondID || room.recipientID === id) {
                //     return true;
                // }
                return false;
            });
            if (find === undefined) {
                return null;
            } else {
                return find;
            }
        } catch (error) {
            return error as FirebaseError;
        }
    }

    // для обноружения и уведомления непрочитаных сообщениях
    public async unreadNotificationsMessage(ownUserID: string): Promise<void> {
        const coll = collection(this.database, this.pathChatsRoom);
        const rooms = await getDocs(coll);
        const filter = rooms.docs.filter(
            (room) => room.data().userID === ownUserID || room.data().recipientID === ownUserID
        );

        filter.forEach((room) => {
            const messageCollection = collection(room.ref, 'message');
            let notifyObj: Notify[] = [];
            let tempRoomID = room.ref.id;
            let tempCountMessage = 0;

            onSnapshot(messageCollection, (snapshot) => {
                notifyObj = [];
                snapshot.docChanges().forEach((change) => {
                    const message = change.doc.data() as INewMessage;
                    if (message.isRead === false) {
                        const roomID = change.doc.ref.parent.parent?.id;
                        if (roomID !== undefined) {
                            console.log('Не прочитаное сообщения');
                            console.log('ROOM::', roomID, 'MESSAGE::', message);
                            // if (tempRoomID === roomID) {
                            tempCountMessage += 1;
                            // } else {
                            //     tempCountMessage = 0;
                            // }
                        }
                    }
                });
                notifyObj.push({ roomID: tempRoomID, countMessage: tempCountMessage });
                console.log(notifyObj, 'jgdgjdhgdkdhgdh');

                EventBus.instance.emit(EventBus.instance.eventType.NOTIFICATION, notifyObj);
            });
        });
    }

    public updateMessageAsRead(roomID: string, messageID: string): void {
        const docRoom = doc(this.chatRooms, roomID);
        const messageCollection = collection(docRoom, 'message');
        const docRef = doc(messageCollection, messageID);
        console.log('updateMessageAsRead::<<', docRef.id);
        updateDoc(docRef, {
            isRead: true,
        });
    }

    public updateMessageAllAsRead(roomID: string): void {
        const docRoom = doc(this.chatRooms, roomID);
        const messageCollection = collection(docRoom, 'message');
        onSnapshot(messageCollection, (snaphot) => {
            snaphot.forEach((msg) => {
                updateDoc(msg.ref, {
                    isRead: true,
                });
            });
        });
    }
}

export default ChatServiсe;
