import { DataSnapshot } from 'firebase/database';
import { DocumentSnapshot } from 'firebase/firestore/lite';
import EventBus from '../../../app/event_bus/EventBus';
import Observer from '../../../app/observer/Observer';
import IChatRoom from '../../../firebase/model/IChatRoom';
import IFollower from '../../../firebase/model/IFollower';
import IMessage from '../../../firebase/model/IMessage';
import INewMessage from '../../../firebase/model/INewMessage';
import ISubscription from '../../../firebase/model/ISubscription';
import IUser from '../../../firebase/model/IUser';
import ChatServiсe from '../../../firebase/service/ChatServiсe';
import FollowersService from '../../../firebase/service/FollowersService';
import SubscriptionsService from '../../../firebase/service/SubscriptionsService';
import UserService from '../../../firebase/service/UserSevice';
import UserState from '../../../state/UserState';
import ChatComponent from '../component/ChatComponents';
import EventType from '../type/EventType';
import RecipientRoom from '../type/RecipientRoom';
import RecipientStartDialog from '../type/RecipientStartDialog';
import SubFolType from '../type/SubFolType';

class MessageModel {
    private $observer: Observer;
    private chatRoomID: string | null = null;

    constructor(obServer: Observer) {
        this.$observer = obServer;
    }

    public init() {
        this.getChatRooms();
        this.$observer.subscribe(EventType.INIT_OPEN_MODAL, this.onGetFollowsAndSubscriptions);
        this.$observer.subscribe(EventType.CREATE_CHAT_ROOM, this.onCreateChatRoom);
        this.$observer.subscribe(EventType.START_DIALOG, this.onGetRoomID);
        this.$observer.subscribe(EventType.SEND_MESSAGE, this.onSendMessage);
        EventBus.instance.subscribe(EventBus.instance.eventType.LOAD_MESSAGE, this.onLoadMessage);
    }

    public unmount(): void {
        this.$observer.unsubscribe(EventType.INIT_OPEN_MODAL, this.onGetFollowsAndSubscriptions);
        this.$observer.unsubscribe(EventType.CREATE_CHAT_ROOM, this.onCreateChatRoom);
        this.$observer.unsubscribe(EventType.START_DIALOG, this.onGetRoomID);
        this.$observer.unsubscribe(EventType.SEND_MESSAGE, this.onSendMessage);
        EventBus.instance.unsubscribe(EventBus.instance.eventType.LOAD_MESSAGE, this.onLoadMessage);
    }

    // Получаем все чат комнаты при инициализации когда обновляем браузер
    private async getChatRooms(): Promise<void> {
        const ownUserID = UserState.instance.UserID;
        console.log(ownUserID);
        if (ownUserID === null) return;
        const rooms = await ChatServiсe.instance.getAllChatRoomBySelfUserID(ownUserID);
        const users = await UserService.instance.getAllUser();
        if (rooms === null || users === null) return;
        console.log(rooms);
        console.log(users);
        const filterUser = users.filter((user) => user.id !== ownUserID);

        const data: RecipientRoom[] = [];

        for (let i = 0; i < filterUser.length; i++) {
            const user = filterUser[i];

            for (let t = 0; t < rooms.length; t++) {
                const room = rooms[t];
                if (room.userID === user.id || room.recipientID === user.id) {
                    const obj: RecipientRoom = {
                        recipientUser: user,
                        room: room,
                    };

                    data.push(obj);
                    break;
                }
                // if (user.id === room.recipientID) {
                //     const obj: RecipientRoom = {
                //         recipientUser: user,
                //         room: room,
                //     };

                //     data.push(obj);
                //     break;
                // }
            }
        }

        console.log(data);

        this.$observer.emit(EventType.INIT_GET_ALL_CHAT__ROOM, data);
    }

    // Получает Всех Фоловеров и Подписки для модального окна в Message
    private onGetFollowsAndSubscriptions = async (
        empty: object,
        cb?: (data: (ISubscription & IFollower)[]) => void
    ) => {
        const ownUserId = UserState.instance.UserID;
        if (ownUserId === null) return;

        const getFollowers = await FollowersService.instance.getFollowers(ownUserId);
        const getSubscriptions = await SubscriptionsService.instance.getSubscriptions(ownUserId);

        let filter: (ISubscription & IFollower)[] = [];

        if (getFollowers !== null) {
            filter.push(...getFollowers);
        }

        if (getSubscriptions !== null) {
            filter.push(...getSubscriptions);
        }

        console.log(filter);

        filter = filter.filter((val) => val.id !== ownUserId);

        if (filter) {
            if (cb !== undefined) {
                cb(filter);
            }
        }
        // console.log(filter);
        // console.log(getFollowers);
        // console.log(getSubscriptions);
    };

    // Создает комнаты для чата
    private onCreateChatRoom = (idArr: string[]) => {
        const ownUserID = UserState.instance.UserID;
        if (ownUserID === null) return;

        idArr.forEach(async (id) => {
            await ChatServiсe.instance.createChatRoom(ownUserID, id);
            ChatServiсe.instance.recieveEventGetRoom = this.recive;
        });
    };

    // Отправлем сразу во вьюшку данные комнаты после создания комнаты
    private recive = async (room: IChatRoom) => {
        const recipientUser = await UserService.instance.getUser(room.recipientID);
        if (recipientUser === null) return;
        const data: RecipientRoom = {
            recipientUser: recipientUser,
            room: room,
        };
        this.$observer.emit(EventType.GET_CHAT_ROOM, data); // Event
        console.log('Получил ЭВЕНТ');
    };

    // запоминаем ид команты
    private onGetRoomID = (roomID: RecipientStartDialog) => {
        this.chatRoomID = roomID.roomID;
        console.log('SAVE ROOM ID:: ', this.chatRoomID);
    };

    // Отпровлчем сообщения
    private onSendMessage = async (message: string) => {
        if (this.chatRoomID === null) return;
        await ChatServiсe.instance.saveMessage(this.chatRoomID, message);
    };

    // Отлавливаем сообщения в реальном времени
    private onLoadMessage = (message: INewMessage) => {
        console.log('RECIEVE_MESSAGE::', message);
        this.$observer.emit(EventType.RECEIVE_MESSAGE, message);
    };
}

export default MessageModel;
