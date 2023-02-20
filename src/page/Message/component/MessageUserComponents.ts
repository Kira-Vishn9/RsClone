import Observer from '../../../app/observer/Observer';
import EventType from '../type/EventType';

class MessageUserComponents {
    private $observer: Observer;
    private root: HTMLElement | null = null;
    private name = '';
    private attribute: string | undefined;

    public constructor(observer: Observer) {
        this.$observer = observer;
    }

    public init(parent: HTMLElement): void {
        this.root = parent.querySelector('.message-user');
        if (this.root === null) return;
        this.root.addEventListener('click', this.onSelectStartDialog);
    }

    public unmount(): void {
        this.root?.removeEventListener('click', this.onSelectStartDialog);
    }

    public make(avatar: string | undefined, name: string, message: string, attrib: string | undefined): string {
        this.name = name;
        this.attribute = attrib;
        return `
        <div class="message-user" chat-room="${attrib === undefined ? '' : attrib}">
            <img class="message-avatar" src="${avatar}">
            <div class="message-content">
              <p class="message-content-title">${name}</p>
              <p class="message-content-subtitle">${message}</p>
            </div>
        </div>
      `;
    }

    private elem: HTMLElement | null = null;
    public setRecipientHTML(elem: HTMLElement | null): void {
        if (elem === null) return;
        this.elem = elem;
    }

    private onSelectStartDialog = () => {
        if (this.elem === null) return;
        this.elem.textContent = this.name;
        if (this.attribute === undefined) return;
        this.$observer.emit(EventType.START_DIALOG, this.attribute);
    };
}

export default MessageUserComponents;
