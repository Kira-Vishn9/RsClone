import { DataSnapshot } from 'firebase/database';
import Observer from '../../../app/observer/Observer';
import INewMessage from '../../../firebase/model/INewMessage';
import EventType from '../type/EventType';
import '../style/chat.scss';

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
    }

    public unmount(): void {
        this.send?.removeEventListener('click', this.onSendMessage);
    }

    public make() {
        const html = `
        <div class="wrapper-dialog-window">
            <div class="place-for-message">


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
            <span>${message}</span>
        </div>
        `;
        this.placeMessage?.insertAdjacentHTML('beforeend', data);
    }

    private makeInterLocutorsMessages(message: string, photoURL: string): void {
        const data = `
        <div class="interlocutor">
            <img src="${photoURL}" alt="userPhoto" style="width: 25px; height: 25px;">
            <span>${message}</span>
        </div>
        `;
        this.placeMessage?.insertAdjacentHTML('afterbegin', data);
    }

    private onSendMessage = () => {
        if (this.input === null) return;
        const message = this.input?.value;
        this.input.value = '';
        this.$observer.emit(EventType.message, message, (data: INewMessage) => {
            this.makeOwnMessage(data.text);
        });
    };
}
export default ChatComponent;
