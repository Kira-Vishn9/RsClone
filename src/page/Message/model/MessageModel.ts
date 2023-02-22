import { DataSnapshot } from 'firebase/database';
import { DocumentSnapshot } from 'firebase/firestore/lite';
import EventBus from '../../../app/event_bus/EventBus';
import Observer from '../../../app/observer/Observer';
import IFollower from '../../../firebase/model/IFollower';
import IMessage from '../../../firebase/model/IMessage';
import INewMessage from '../../../firebase/model/INewMessage';
import ISubscription from '../../../firebase/model/ISubscription';
import ChatServiсe from '../../../firebase/service/ChatServiсe';
import FollowersService from '../../../firebase/service/FollowersService';
import SubscriptionsService from '../../../firebase/service/SubscriptionsService';
import UserService from '../../../firebase/service/UserSevice';
import UserState from '../../../state/UserState';
import ChatComponent from '../component/ChatComponents';
import EventType from '../type/EventType';
import SubFolType from '../type/SubFolType';

class MessageModel {
    private $observer: Observer;
    private chatRoomID: string | null = null;

    constructor(obServer: Observer) {
        this.$observer = obServer;
    }

    public init() {
        this.getRooms();
        this.$observer.subscribe(EventType.CREATE_CHAT_ROOM, this.onCreateChatRoom);
        this.$observer.subscribe(EventType.openModal, this.getFollowsAndSubscriptions);
        this.$observer.subscribe(EventType.SEND_MESSAGE, this.onHandlerMessage);
        this.$observer.subscribe(EventType.START_DIALOG, this.onStartDialog);
        EventBus.instance.subscribe(EventBus.instance.eventType.LOAD_MESSAGE, this.onLoadMessage);
    }

    public unmount(): void {
        this.$observer.unsubscribe(EventType.CREATE_CHAT_ROOM, this.onCreateChatRoom);
        this.$observer.unsubscribe(EventType.openModal, this.getFollowsAndSubscriptions);
        this.$observer.unsubscribe(EventType.SEND_MESSAGE, this.onHandlerMessage);
        this.$observer.unsubscribe(EventType.START_DIALOG, this.onStartDialog);
        EventBus.instance.unsubscribe(EventBus.instance.eventType.LOAD_MESSAGE, this.onLoadMessage);
    }

    // Получает Всех Фоловеров для модального окна в Message
    // eslint-disable-next-line prettier/prettier
    private getFollowsAndSubscriptions = async (empty: object, cb?: (subFol: SubFolType[]) => void) => {
        const myUserId = UserState.instance.UserID;
        if (myUserId === null) return;
        const myFollowers = await FollowersService.instance.getFollowers(myUserId);
        const mySubscriptions = await SubscriptionsService.instance.getSubscriptions(myUserId);

        const args: SubFolType[] = [];

        if (myFollowers !== null) {
            args.push(...myFollowers);
        }

        if (mySubscriptions !== null) {
            args.push(...mySubscriptions);
        }

        if (args === undefined) return;
        for (let i = 0; i < args.length; i += 1) {
            const elem = args[i];
            const nextIndex = i + 1;
            if (nextIndex >= args.length) break;
            if (elem.userID === args[nextIndex].userID) {
                args.splice(i, 1);
                i = 0;
            }
        }

        if (cb !== undefined) {
            cb(args);
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
    // << END

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
    private onHandlerMessage = async (message: string) => {
        if (this.chatRoomID === null) return;

        await ChatServiсe.instance.saveMessage(this.chatRoomID, message);
    };

    private onStartDialog = async (roomID: string) => {
        this.chatRoomID = roomID;
        const messageArr = await ChatServiсe.instance.getAllMessagesByRoomID(roomID);
        if (messageArr === null) return;
        // cb(messageArr);
        this.$observer.emit(EventType.GET_ALL_MESSAGE_START_DIALOG, messageArr);
        console.log(messageArr);
    };

    private onLoadMessage = (message: INewMessage) => {
        this.$observer.emit(EventType.RECEIVE_MESSAGE, message);
    };
}

export default MessageModel;
