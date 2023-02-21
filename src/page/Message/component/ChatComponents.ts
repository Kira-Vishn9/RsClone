import { DataSnapshot } from 'firebase/database';
import Observer from '../../../app/observer/Observer';
import INewMessage from '../../../firebase/model/INewMessage';
import EventType from '../type/EventType';
import '../style/chat.scss';
import UserState from '../../../state/UserState';

class ChatComponent {
    private root: HTMLElement | null = null;
    private send: HTMLElement | null = null;
    private input: HTMLInputElement | null = null;
    private $observer: Observer;
    private placeMessage: HTMLElement | null = null;

    constructor(observe: Observer) {
        this.$observer = observe;
    }

    public init(parent: HTMLElement) {
        this.root = parent.querySelector('.wrapper-dialog-window');
        if (this.root === null) return;

        this.send = this.root.querySelector('.wrapper-input__submit');
        this.input = this.root.querySelector('.wrapper-input__textarea');
        this.placeMessage = this.root.querySelector('.place-for-message');
        this.send?.addEventListener('click', this.onSendMessage);
        this.input?.addEventListener('keydown', this.onSendMessage);
        this.$observer.subscribe(EventType.GET_ALL_MESSAGE_START_DIALOG, this.onGetAllMessageByChatRoom);
        this.$observer.subscribe(EventType.RECEIVE_MESSAGE, this.onReceiveMessage);
    }

    public unmount(): void {
        this.send?.removeEventListener('click', this.onSendMessage);
        this.input?.removeEventListener('keydown', this.onSendMessage);
        this.$observer.unsubscribe(EventType.RECEIVE_MESSAGE, this.onReceiveMessage);
        this.$observer.unsubscribe(EventType.GET_ALL_MESSAGE_START_DIALOG, this.onGetAllMessageByChatRoom);
    }

    public make() {
        const html = `
        <div class="wrapper-dialog-window">
            <div class="wrapper-dialog-window__content">
                <div class="place-for-message">


                </div>
            </div>
            <div class="wrapper-input">
                <textarea id="message" class="wrapper-input__textarea" name="message" cols="" rows=""></textarea>
                <span class="wrapper-input__submit"></span>
            </div>
        </div>
    `;
        return html;
    }

    private makeOwnMessage(message: string): void {
        const data = `
        <div class="you-message">
            <div class="you-message__content">
                <span class="you-message__text">${message}</span>
            </div>
        </div>
        `;

        if (this.placeMessage == null) return;
        this.placeMessage.insertAdjacentHTML('beforeend', data);
        this.placeMessage.scrollTo(0, this.placeMessage.scrollHeight);
    }

    private makeInterLocutorsMessages(photoURL: string, name: string, message: string): void {
        const data = `
        <div class="interlocutor">
            <img src="${photoURL}" alt="userPhoto" style="width: 25px; height: 25px;">
            <div class="interlocutor__content">
                <span class="interlocutor__name">${name}</span>
                <span class="interlocutor__text">${message}</span>
            </dib>
        </div>
        `;

        if (this.placeMessage == null) return;
        this.placeMessage.insertAdjacentHTML('beforeend', data);
        this.placeMessage.scrollTo(0, this.placeMessage.scrollHeight);
    }

    private onSendMessage = (event: Event) => {
        if (event instanceof KeyboardEvent) {
            if (event.key === 'Enter') {
                this.message();
            }
        } else {
            this.message();
        }
    };

    private message(): void {
        if (this.input === null) return;
        this.input.value = this.input.value.trim();
        if (this.input.value === '') return;

        const message = this.input?.value;
        this.input.value = '';
        this.$observer.emit(EventType.SEND_MESSAGE, message);
    }

    private onReceiveMessage = (message: INewMessage) => {
        console.log(message);
        console.log('Receive__Message: ', message);
        if (message.userID === UserState.instance.CurrentUser?.uid) {
            this.makeOwnMessage(message.text);
        } else {
            this.makeInterLocutorsMessages('', message.name, message.text);
        }
    };

    private onGetAllMessageByChatRoom = (messageArr: INewMessage[]) => {
        if (this.placeMessage === null) return;

        this.placeMessage.innerHTML = '';

        messageArr.forEach((message: INewMessage) => {
            if (message.userID === UserState.instance.CurrentUser?.uid) {
                this.makeOwnMessage(message.text);
            } else {
                this.makeInterLocutorsMessages('', message.name, message.text);
            }
        });
    };
}
export default ChatComponent;
