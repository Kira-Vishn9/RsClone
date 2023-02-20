import Observer from '../../../app/observer/Observer';
import UserState from '../../../state/UserState';
import '../style/sub.foll.modal.scss';
import EventType from '../types/EventType';

class SubFollModal {
    private $observer: Observer;
    private root: HTMLElement | null = null;
    private container: HTMLElement | null = null;

    private btn: HTMLButtonElement | null = null;
    private contentItem: HTMLElement | null = null;
    public constructor(observer: Observer) {
        this.$observer = observer;
    }

    public init(): void {
        this.root = document.querySelector('#sub-foll-modal');
        if (this.root === null) return;
        this.container = this.root.querySelector('.container-block__sub-foll');

        this.root.addEventListener('click', this.onOpenCloseModal);
        this.container?.addEventListener('click', this.onContainerItem);
    }

    public render(): string {
        return `
        <div id="sub-foll-modal">
            <div class="content__sub-foll">
                <h2 class="title__sub-foll">Ваши подписки</h2>

                <div class="container-block__sub-foll"></div>
            </div>
        </div>
        `.trim();
    }

    // eslint-disable-next-line prettier/prettier
    public makeItem(
        avatar: string = '',
        fullName: string,
        nickName: string,
        subID: string = '',
        userID: string,
        btnName: string = 'Отписаться'
    ): void {
        const item = `
        <div class="item__sub-foll" sub-id="${subID}" user-id="${userID}">
            <div class="content__item">
                <img class="avatar__item" src="${avatar}">
                <div class="text-content__item">
                    <span class="nick-name__item">${nickName}</span>
                    <span class="full-name__item">${fullName}</span>
                </div>
            </div>
            <button class="btn-subscriptions__item">${btnName}</button>
        </div>
        `.trim();
        this.container?.insertAdjacentHTML('afterbegin', item);
        if (this.root !== null) {
            this.btn = this.root.querySelector('.btn-subscriptions__item');
            this.btn?.addEventListener('click', this.onButtonClick);
            this.contentItem = this.root.querySelector('.content__item');
            this.contentItem?.addEventListener('click', this.onRedirect);
        }
    }

    private onOpenCloseModal = (event: Event) => {
        if (!(event.target instanceof HTMLElement)) return;

        const target = event.target;

        if (target.id === 'sub-foll-modal') {
            this.selfDestroy();
        }
    };

    private selfDestroy(): void {
        this.btn?.removeEventListener('click', this.onButtonClick);
        this.container?.removeEventListener('click', this.onContainerItem);
        this.root?.removeEventListener('click', this.onOpenCloseModal);
        this.contentItem?.removeEventListener('click', this.onRedirect);
        this.root?.remove();
    }

    private onButtonClick = (event: Event) => {
        if (!(event.target instanceof HTMLElement)) return;
        const target = event.target;
        const subID = target.closest('.item__sub-foll')?.getAttribute('sub-id');
        if (subID === '' || subID === null || subID === undefined) return;
        this.$observer.emit(EventType.MODAL_UNSUBSCRIPTIONS, subID);
        target.closest('.item__sub-foll')?.remove();
    };

    private onContainerItem = () => {
        //
    };

    private onRedirect = (event: Event) => {
        if (!(event.target instanceof HTMLElement)) return;
        const target = event.target;
        const item = target.closest('.item__sub-foll');
        if (item === null) return;
        const getUserID = item?.getAttribute('user-id');
        const nickName = item.querySelector('.nick-name__item');

        if (getUserID === null || nickName === null) return;

        UserState.instance.AnotherUserID = getUserID; // << КОСТЫЛЬ //TODO Refactor
        window.location.hash = `#/profile/${nickName.textContent}`; // << КОСТЫЛЬ //TODO Refactor
        this.selfDestroy();
    };
}

export default SubFollModal;
