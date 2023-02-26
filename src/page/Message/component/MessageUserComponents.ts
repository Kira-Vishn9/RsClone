import Observer from '../../../app/observer/Observer';
import { LocalStorage } from '../../../localStorage/localStorage';
import key from '../common/local.storage.key';
import EventType from '../type/EventType';
import RecipientStartDialog from '../type/RecipientStartDialog';

class MessageUserComponents {
    private $observer: Observer;
    private root: HTMLElement | null = null;
    private name = '';
    private attribute: string | undefined;
    private avatars: string | undefined;

    public constructor(observer: Observer) {
        this.$observer = observer;
    }

    public init(parent: HTMLElement): void {
        this.root = parent.querySelector('.message-user');
        if (this.root === null) return;
        this.root.addEventListener('click', this.onSelectChatRoom);
        this.$observer.subscribe(EventType.NOTIFICATION, this.onNotification);
    }

    public unmount(): void {
        this.root?.removeEventListener('click', this.onSelectChatRoom);
        this.$observer.unsubscribe(EventType.NOTIFICATION, this.onNotification);
    }

    public make(avatar: string | undefined, name: string, message: string, attrib: string | undefined): string {
        this.avatars = avatar;
        this.name = name;
        this.attribute = attrib;
        return `
        <div class="message-user" chat-room="${attrib === undefined ? '' : attrib}">
            <div class="message-user__left">
                <img class="message-avatar" src="${avatar}">
                <span class="message-user__notifications hidden"></span>
            </div>
            <div class="message-content">
              <p class="message-content-title">${name}</p>
              <p class="message-content-subtitle">${message}</p>
            </div>
        </div>
      `;
    }

    // Вызывается во view
    private elem: HTMLElement | null = null;
    public setRecipientHTML(elem: HTMLElement | null): void {
        if (elem === null) return;
        this.elem = elem;
    }

    private onSelectChatRoom = () => {
        // if (this.elem === null) return;
        // this.elem.textContent = this.name;
        if (this.attribute === undefined) return;
        console.log(this.attribute);
        const startDialogInfo: RecipientStartDialog = {
            avatar: this.avatars === undefined ? '' : this.avatars,
            name: this.name,
            roomID: this.attribute,
        };
        // LocalStorage.instance.setData(key, this.attribute);
        this.$observer.emit(EventType.START_DIALOG, startDialogInfo);
    };

    private onNotification = (notifi: { roomID: string; countMessage: number }[]) => {
        if (this.root === null) return;
        const notifiHtmlElem: HTMLElement | null = this.root?.querySelector('.message-user__notifications');
        if (notifiHtmlElem === null) return;
        const nt = notifi[0];
        if (nt.roomID === this.attribute) {
            if (nt.countMessage > 0) {
                console.log('qweqweqweqweqweqwe');
                notifiHtmlElem.classList.remove('hidden');
                notifiHtmlElem.textContent = `${nt.countMessage}`;
            } else {
                notifiHtmlElem.classList.add('hidden');
            }
        }
    };
}

export default MessageUserComponents;
