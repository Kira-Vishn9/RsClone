import { DataSnapshot } from 'firebase/database';
import { DocumentSnapshot } from 'firebase/firestore/lite';
import Observer from '../../../app/observer/Observer';
import IFollower from '../../../firebase/model/IFollower';
import IMessage from '../../../firebase/model/IMessage';
import INewMessage from '../../../firebase/model/INewMessage';
import ChatServiсe from '../../../firebase/service/ChatServiсe';
import FollowersService from '../../../firebase/service/FollowersService';
import UserService from '../../../firebase/service/UserSevice';
import UserState from '../../../state/UserState';
import ChatComponent from '../component/ChatComponents';
import EventType from '../type/EventType';

class MessageModel {
    private $observer: Observer;
    private chatRoomID: string | null = null;

    constructor(obServer: Observer) {
        this.$observer = obServer;
    }

    public init() {
        this.getRooms();
        this.$observer.subscribe(EventType.CREATE_CHAT_ROOM, this.onCreateChatRoom);
        this.$observer.subscribe(EventType.openModal, this.getFollows);
        this.$observer.subscribe(EventType.message, this.onHandlerMessage);
        this.$observer.subscribe(EventType.START_DIALOG, this.onStartDialog);
    }

    public unmount(): void {
        this.$observer.unsubscribe(EventType.CREATE_CHAT_ROOM, this.onCreateChatRoom);
        this.$observer.unsubscribe(EventType.openModal, this.getFollows);
        this.$observer.unsubscribe(EventType.message, this.onHandlerMessage);
        this.$observer.unsubscribe(EventType.START_DIALOG, this.onStartDialog);
    }

    // Получает Всех Фоловеров для модального окна в Message
    private getFollows = async (empty: object, callbackFollowers?: (folloers: IFollower[]) => void) => {
        const myUserId = UserState.instance.UserID;
        if (myUserId === null) return;
        const myFollowers = await FollowersService.instance.getFollowers(myUserId);
        if (myFollowers === null) return;
        if (callbackFollowers !== undefined) {
            callbackFollowers(myFollowers);
        }
    };

    // Создает комнуту для чата когда нажимает кнопку далее в модалке в Message
    private onCreateChatRoom = async (data: { firstID: string; secondID: string }) => {
        // this.userId = data.userID;
        // this.recipienId = data.recipientId;
        // this.resipientName = data.recipientName;
        // this.avatarsUrl = data.recipientAvatar;

        await ChatServiсe.instance.createChatRoom(data.firstID, data.secondID);
        this.chatRoomID = ChatServiсe.instance.RoomID;
        if (this.chatRoomID !== null) {
            // ChatServiсe.instance.loadMessage(this.onWatchMessage);
        }
        await this.getUser(data.secondID);
    };

    private async getUser(recipientID: string): Promise<void> {
        const user = await UserService.instance.getUser(recipientID);
        this.$observer.emit(EventType.INIT_CHAT_ROOM, user);
    }

    // Получить все Комнаты чатов где есть self user id
    private async getRooms(): Promise<void> {
        const id = UserState.instance.UserID;
        if (id === null) return;
        const rooms = await ChatServiсe.instance.getAllChatRoomBySelfUserID(id);
        if (rooms === null) return;
        const allRecipientUser = rooms.map((user) => {
            if (user.userID === id) {
                return user.recipientID;
            } else if (user.recipientID === id) {
                return user.userID;
            }
        });

        const allUser = await UserService.instance.getAllUser();

        if (allUser !== null) {
            const find = allUser.filter((user) => {
                if (user.id === undefined) return;
                return allRecipientUser.includes(user.id);
            });

            const findObj = {
                users: find,
                rooms: rooms,
            };
            this.$observer.emit(EventType.GET_ALL_CHAT_ROOM, findObj);
        }
    }

    // Срабатывает когда отправляем сообщение в Message
    private onHandlerMessage = async (message: string, cb?: (data: INewMessage) => void) => {
        if (this.chatRoomID === null) return;

        await ChatServiсe.instance.saveMessage(this.chatRoomID, message);

        if (cb !== undefined) {
            // ChatServiсe.instance.loadMessage(cb);
        }
    };

    private onStartDialog = (roomID: string) => {
        this.chatRoomID = roomID;
    };
}

export default MessageModel;
