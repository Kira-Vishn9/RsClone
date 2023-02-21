import Observer from '../../../app/observer/Observer';
import IChatRoom from '../../../firebase/model/IChatRoom';
import IFollower from '../../../firebase/model/IFollower';
import IUser from '../../../firebase/model/IUser';
import UserState from '../../../state/UserState';
import ChatComponent from '../component/ChatComponents';
import MessageModal from '../modal/messageModal';
import EventType from '../type/EventType';
import MessageUserComponents from '../component/MessageUserComponents';
import '../style/message-page.scss';
import ISubscription from '../../../firebase/model/ISubscription';
import SubFolType from '../type/SubFolType';

class MessageView {
    private sendBth: HTMLElement | null = null;
    private root: HTMLElement | null = null;
    private placeChat: HTMLElement | null = null;
    private $observer: Observer;
    private chat: ChatComponent;

    private name: HTMLElement | null = null;
    private recipientName: HTMLElement | null = null;

    private containerBlockLeft: HTMLElement | null = null;

    public constructor(observer: Observer) {
        this.$observer = observer;
        this.chat = new ChatComponent(this.$observer);
    }

    public init(): void {
        this.root = document.querySelector('.message-block');
        if (this.root === null) return;

        this.containerBlockLeft = this.root.querySelector('.message-block__left-main');

        this.placeChat = this.root.querySelector('.message-block__right-main');
        this.sendBth = this.root.querySelector('.send-btn');
        this.name = this.root.querySelector('.message-name');
        this.recipientName = this.root.querySelector('.user-name');

        this.sendBth?.addEventListener('click', this.openModalM);
        this.root.addEventListener('click', this.showMessage);

        this.$observer.subscribe(EventType.INIT_CHAT_ROOM, this.onApendUserToMessageBlockLeft);
        this.$observer.subscribe(EventType.GET_ALL_CHAT_ROOM, this.onGetAllChatRooms);
        this.$observer.subscribe(EventType.START_DIALOG, this.onStartDialog);
    }

    public unmount(): void {
        this.chat.unmount();
        this.$observer.unsubscribe(EventType.INIT_CHAT_ROOM, this.onApendUserToMessageBlockLeft);
        this.$observer.unsubscribe(EventType.GET_ALL_CHAT_ROOM, this.onGetAllChatRooms);
        this.$observer.unsubscribe(EventType.START_DIALOG, this.onStartDialog);

        this.messageUserComponentArr.forEach((elem) => {
            elem.unmount();
        });
        this.messageUserComponentArr = [];
    }

    public make(): string {
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
            <div class="message-block__right-header hidden">
              <a class="user-message" href="#">
                <img class="user-avatar" src="https://amiel.club/uploads/posts/2022-03/1647762844_3-amiel-club-p-kartinki-litsa-cheloveka-3.png" alt="avatar">
                <span class="user-name">Tomas</span>
              </a>
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

    private onStartDialog = (recipientID: string) => {
        if (this.placeChat === null) return;
        this.placeChat.innerHTML = '';
        this.placeChat.insertAdjacentHTML('afterbegin', this.chat.make());
        this.chat.init(this.placeChat);
    };

    private messageUserComponentArr: MessageUserComponents[] = [];
    private onApendUserToMessageBlockLeft = (user: IUser) => {
        const component = new MessageUserComponents(this.$observer);
        const make = component.make(user.avatar, user.nickName, 'Hello', user.id);
        this.containerBlockLeft?.insertAdjacentHTML('afterbegin', make);
        if (this.root !== null) {
            component.init(this.root);
            component.setRecipientHTML(this.recipientName);
        }
        this.messageUserComponentArr.push(component);
    };

    private onGetAllChatRooms = (data: { users: IUser[]; rooms: IChatRoom[] }) => {
        if (this.containerBlockLeft === null) return;

        data.rooms.forEach((room) => {
            const findUser = data.users.find((user) => {
                if (user.id === undefined) return;
                if (room.recipientID === user.id) {
                    return user.id;
                }
            });

            console.log(findUser);

            if (findUser !== undefined && this.root !== null) {
                const component = new MessageUserComponents(this.$observer);
                const make = component.make(findUser.avatar, findUser.nickName, 'Hello', room.chatID);
                this.containerBlockLeft?.insertAdjacentHTML('afterbegin', make);

                component.init(this.root);
                component.setRecipientHTML(this.recipientName);

                this.messageUserComponentArr.push(component);
            }
        });
    };

    private showMessage(): void {
        const messageInfo = document.querySelector('.message-block__right-header');
        const messageBlock = document.querySelector('.message-block__right-main');
        if (messageInfo && messageBlock) {
            messageInfo.classList.remove('hidden');
            // messageBlock.innerHTML = '';
        }
    }

    private openModalM = () => {
        const messageModal = new MessageModal(this.$observer);
        this.$observer.emit(EventType.openModal, {}, (data: SubFolType[]) => {
            this.root?.insertAdjacentHTML('afterbegin', messageModal.make());
            messageModal.init();

            for (let i = 0; i < data.length; i++) {
                let avatar = data[i].avatar;
                if (avatar === undefined) continue;
                messageModal.makeItem(avatar, data[i].fullname, data[i].userID);
            }
        });
    };
}

export default MessageView;
