import EventBus from '../../../app/event_bus/EventBus';
import Observer from '../../../app/observer/Observer';
import IChatRoom from '../../../firebase/model/IChatRoom';
import IFollower from '../../../firebase/model/IFollower';
import IMessage from '../../../firebase/model/IMessage';
import ISubscription from '../../../firebase/model/ISubscription';
import ChatServiсe from '../../../firebase/service/ChatServiсe';
import FollowersService from '../../../firebase/service/FollowersService';
import SubscriptionsService from '../../../firebase/service/SubscriptionsService';
import UserService from '../../../firebase/service/UserSevice';
import UserState from '../../../state/UserState';
import EventType from '../type/EventType';
import RecipientRoom from '../type/RecipientRoom';
import RecipientStartDialog from '../type/RecipientStartDialog';

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
        // EventBus.instance.subscribe(EventBus.instance.eventType.NOTIFICATION, this.onNotifications);
    }

    public unmount(): void {
        this.$observer.unsubscribe(EventType.INIT_OPEN_MODAL, this.onGetFollowsAndSubscriptions);
        this.$observer.unsubscribe(EventType.CREATE_CHAT_ROOM, this.onCreateChatRoom);
        this.$observer.unsubscribe(EventType.START_DIALOG, this.onGetRoomID);
        this.$observer.unsubscribe(EventType.SEND_MESSAGE, this.onSendMessage);
        EventBus.instance.unsubscribe(EventBus.instance.eventType.LOAD_MESSAGE, this.onLoadMessage);
        // EventBus.instance.unsubscribe(EventBus.instance.eventType.NOTIFICATION, this.onNotifications);
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

        // await ChatServiсe.instance.unreadNotificationsMessage(ownUserID); //<< Читаем с EventBus ппц жопа код
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

        let union: (ISubscription & IFollower)[] = [];

        if (getFollowers !== null) {
            union.push(...getFollowers);
        }

        if (getSubscriptions !== null) {
            union.push(...getSubscriptions);
        }

        const filter: (ISubscription & IFollower)[] = [union[0]];

        // union = union.filter((val) => !(val.userID === ownUserId));
        // filter = filter.filter((val) => val.userID === val.userID);

        for (let i = 0; i < union.length; i += 1) {
            const elem = union[i];
            const result = checkDublicat(elem);
            if (result === false) {
                filter.push(elem);
            }
        }

        function checkDublicat(elem: ISubscription & IFollower): boolean {
            for (let i = 0; i < filter.length; i++) {
                const result = filter[i];
                if (result.userID === elem.userID) {
                    return true;
                }
            }
            return false;
        }

        console.log('FILTER:::', filter);
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

    // запоминаем ид команты когда нажали комнату
    private onGetRoomID = async (roomID: RecipientStartDialog) => {
        this.chatRoomID = roomID.roomID;
        console.log('SAVE ROOM ID:: ', this.chatRoomID);
        await this.getAllMessageForRoom();

        // Меняем сообщения с не прочитанного на прочитанное
        if (this.chatRoomID !== null) {
            const notifi = [{ roomID: this.chatRoomID, countMessage: 0 }];
            // ChatServiсe.instance.updateMessageAllAsRead(this.chatRoomID);
            // this.$observer.emit(EventType.NOTIFICATION, notifi); //<< Отправляем полученгые данные во view
        }
    };

    // Получаем все message при инициализации или обновления браузера когда нажали на комнату
    private async getAllMessageForRoom(): Promise<void> {
        if (this.chatRoomID === null) return;
        const messageArr = await ChatServiсe.instance.getAllMessagesByRoomID(this.chatRoomID);
        console.log(messageArr);
        messageArr?.forEach((message) => {
            console.log('notification::<<::', message);
            this.$observer.emit(EventType.RECEIVE_MESSAGE, message);

            // if (this.chatRoomID !== null) {
            //     ChatServiсe.instance.updateMessageAllAsRead(this.chatRoomID);
            //     const notify = [
            //         {
            //             roomID: this.chatRoomID,
            //             countMessage: 0,
            //         },
            //     ];
            //     this.$observer.emit(EventType.NOTIFICATION, notify); //<< Отправляем полученгые данные во view
            // }
        });
    }

    // Отпровлчем сообщения
    private onSendMessage = async (message: string) => {
        if (this.chatRoomID === null) return;
        await ChatServiсe.instance.saveMessage(this.chatRoomID, message);
    };

    // Отлавливаем сообщения в реальном времени
    private onLoadMessage = (message: IMessage) => {
        console.log('RECIEVE_MESSAGE::', message);
        console.log(this.chatRoomID, 'agagagag');
        this.$observer.emit(EventType.RECEIVE_MESSAGE, message);

        // Меняем сообщения с не прочитанного на прочитанное
        // if (this.chatRoomID !== null && message.messageID !== undefined) {
        //     ChatServiсe.instance.updateMessageAsRead(this.chatRoomID, message.messageID);
        // }
    };

    // Получаем Уведомления не прочитаных сооющений
    private onNotifications = (notifi: { roomID: string; countMessage: number }[]) => {
        console.log('NOTIFI', notifi);
        if (notifi[0].roomID === this.chatRoomID) return;
        console.log('qqqqqqqqq', notifi);
        this.$observer.emit(EventType.NOTIFICATION, notifi); //<< Отправляем полученгые данные во view
    };
}

export default MessageModel;
