import Observer from '../../../app/observer/Observer';
import IChatRoom from '../../../firebase/model/IChatRoom';
import IFollower from '../../../firebase/model/IFollower';
import IUser from '../../../firebase/model/IUser';
import UserState from '../../../state/UserState';
import ChatComponent from '../component/ChatComponents';
import ModalWindow from '../modal/ModalWindow';
import EventType from '../type/EventType';
import MessageUserComponents from '../component/MessageUserComponents';
import '../style/message-page.scss';
import ISubscription from '../../../firebase/model/ISubscription';
import SubFolType from '../type/SubFolType';
import RecipientRoom from '../type/RecipientRoom';
import RecipientStartDialog from '../type/RecipientStartDialog';
import { LocalStorage } from '../../../localStorage/localStorage';
import ProfileHeadComponent from '../../Profile/components/ProfileHeadComponent';

class MessageView {
    private sendBth: HTMLElement | null = null;
    private root: HTMLElement | null = null;
    private placeChat: HTMLElement | null = null;
    private $observer: Observer;
    private chat: ChatComponent;
    private topMessageBtn: HTMLElement | null = null;

    private name: HTMLElement | null = null;
    private recipientName: HTMLElement | null = null;

    private containerBlockLeft: HTMLElement | null = null;
    private recipientInfo: HTMLElement | null = null;

    public constructor(observer: Observer) {
        this.$observer = observer;
        this.chat = new ChatComponent(this.$observer);
    }

    public init(): void {
        this.root = document.querySelector('.message-block');
        if (this.root === null) return;
        this.topMessageBtn = this.root.querySelector('.message-btn');

        this.recipientInfo = this.root.querySelector('.message-block__right-header');
        this.containerBlockLeft = this.root.querySelector('.message-block__left-main');

        this.placeChat = this.root.querySelector('.message-block__right-main');
        this.sendBth = this.root.querySelector('.send-btn');
        this.name = this.root.querySelector('.message-name');
        this.recipientName = this.root.querySelector('.user-name');

        // this.root.addEventListener('click', this.showMessage);

        // this.$observer.subscribe(EventType.INIT_CHAT_ROOM, this.onApendUserToMessageBlockLeft);
        // this.$observer.subscribe(EventType.GET_ALL_CHAT_ROOM, this.onGetAllChatRooms);
        // this.$observer.subscribe(EventType.START_DIALOG, this.onStartDialog);
        this.enable();
    }

    public unmount(): void {
        this.chat.unmount();
        // this.$observer.unsubscribe(EventType.INIT_CHAT_ROOM, this.onApendUserToMessageBlockLeft);
        // this.$observer.unsubscribe(EventType.GET_ALL_CHAT_ROOM, this.onGetAllChatRooms);
        // this.$observer.unsubscribe(EventType.START_DIALOG, this.onStartDialog);

        // this.messageUserComponentArr.forEach((elem) => {
        //     elem.unmount();
        // });
        // this.messageUserComponentArr = [];
        this.disable();
    }

    private enable(): void {
        this.topMessageBtn?.addEventListener('click', this.onOpenModal);
        this.sendBth?.addEventListener('click', this.onOpenModal);
        this.$observer.subscribe(EventType.INIT_GET_ALL_CHAT__ROOM, this.onInitAllChatRoom);
        this.$observer.subscribe(EventType.GET_CHAT_ROOM, this.onGetChatRoom);
        this.$observer.subscribe(EventType.START_DIALOG, this.onInitDialog);
    }

    private disable(): void {
        this.topMessageBtn?.removeEventListener('click', this.onOpenModal);
        this.sendBth?.removeEventListener('click', this.onOpenModal);
        this.$observer.unsubscribe(EventType.INIT_GET_ALL_CHAT__ROOM, this.onInitAllChatRoom);
        this.$observer.unsubscribe(EventType.GET_CHAT_ROOM, this.onGetChatRoom);
        this.$observer.unsubscribe(EventType.START_DIALOG, this.onInitDialog);
    }

    public make(): string {
        console.log(UserState.instance.CurrentUser);
        return `
        <div class="message-block">
          <div class="message-block__left">
            <div class="message-block__left-header">
              <span class="message-name">${UserState.instance.CurrentUser?.displayName}</span>
              <div class="message-btn"></div>
            </div>
            <div class="message-block__left-main">
              

            </div>
          </div>
          <div class="message-block__right">
            <div class="message-block__right-header">
              
            </div>
            <div class="message-block__right-main">
              <div class="message-block__right-img"></div>
              <p class="message-block__right-title">Your Messages</p>
              <p class="message-block__right-text">Send private photos and messages to a friend or group.</p>
              <button class="send-btn">Send Message</button>
            </div>
          </div>
        </div>
      `.trim();
    }

    private makeRecipientInfo(avatar: string | undefined, name: string): string {
        return `
            <a class="user-message">
                <img class="user-avatar" src="${avatar === undefined ? '' : avatar}" alt="avatar">
                <span class="user-name">${name}</span>
            </a>
            `;
    }

    // public make(): string {
    //     return `
    //     <div class="message-block">
    //       <div class="message-block__left">
    //         <div class="message-block__left-header">
    //           <span class="message-name">${UserState.instance.CurrentUser?.displayName}</span>
    //           <div class="message-btn"></div>
    //         </div>
    //         <div class="message-block__left-main">

    //         </div>
    //       </div>
    //       <div class="message-block__right">
    //       ${this.chat.make()}
    //       </div>
    //       <button class="send-btn">Send Message</button>
    //     </div>
    //   `.trim();
    // }

    // Получаем все чат комнаты при инициализации или обновления браузера
    private onInitAllChatRoom = (data: RecipientRoom[]) => {
        data.forEach((elem) => {
            const mUser = new MessageUserComponents(this.$observer);
            const user = elem.recipientUser;
            const room = elem.room;
            this.containerBlockLeft?.insertAdjacentHTML(
                'afterbegin',
                mUser.make(user.avatar, user.nickName, 'Hello', room.chatID)
            );
            if (this.containerBlockLeft !== null) {
                mUser.init(this.containerBlockLeft);
            }
        });

        if (this.placeChat !== null) this.placeChat.innerHTML = '';
    };

    // Открывает модальное окно для добавления user в чат комнату
    private onOpenModal = () => {
        if (this.root === null || this.placeChat === null) return;

        const modal = new ModalWindow(this.$observer);
        modal.init(this.root);

        this.placeChat.innerHTML = '';
    };

    // Добовляем комнату
    private onGetChatRoom = (data: RecipientRoom) => {
        if (this.containerBlockLeft === null) return;
        const mUser = new MessageUserComponents(this.$observer);
        const user = data.recipientUser;
        const room = data.room;
        this.containerBlockLeft?.insertAdjacentHTML(
            'afterbegin',
            mUser.make(user.avatar, user.nickName, 'Hello', room.chatID)
        );
        mUser.init(this.containerBlockLeft);
    };

    private onInitDialog = (data: RecipientStartDialog) => {
        if (this.placeChat === null || this.recipientInfo === null) return;
        this.recipientInfo.innerHTML = '';
        this.placeChat.innerHTML = '';
        this.chat.unmount();
        console.log('JJJJJJJJJJJJJJJJJJJJJJJJJJ', data);
        this.recipientInfo.insertAdjacentHTML('afterbegin', this.makeRecipientInfo(data.avatar, data.name));
        console.log(this.placeChat);
        this.placeChat.insertAdjacentHTML('afterbegin', this.chat.make());
        this.chat.setRecipientDialog(data.avatar, data.name);
        this.chat.init(this.placeChat);
    };
}

export default MessageView;
