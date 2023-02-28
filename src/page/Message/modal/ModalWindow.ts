import { list } from 'firebase/storage';
import Observer from '../../../app/observer/Observer';
import IChatRoom from '../../../firebase/model/IChatRoom';
import UserState from '../../../state/UserState';
import EventType from '../type/EventType';
import '../style/message-modal.scss';
import ISubscription from '../../../firebase/model/ISubscription';
import IFollower from '../../../firebase/model/IFollower';

class ModalWindow {
    private root: HTMLElement | null = null;
    private listHuman: HTMLElement | null = null;
    private btnNext: HTMLElement | null = null;
    private $observer: Observer;

    constructor(observer: Observer) {
        this.$observer = observer;
    }

    public init(parent: HTMLElement): void {
        parent.insertAdjacentHTML('afterbegin', this.make());
        this.root = document.querySelector('.wrapper-overflow');
        if (this.root === null) return;

        this.listHuman = this.root.querySelector('.list-human');
        this.btnNext = this.root.querySelector('.next');
        this.initFollowersAndSubscribtions();
        this.enable();
    }

    private enable(): void {
        this.root?.addEventListener('click', this.onCloseModal);
        this.btnNext?.addEventListener('click', this.onClickBtnNext);
    }

    private disable(): void {
        this.root?.removeEventListener('click', this.onCloseModal);
        this.btnNext?.addEventListener('click', this.onClickBtnNext);
    }

    private make(): string {
        return `
        <div class="wrapper-overflow">
        <div class="wrapper">
            <div class="title">
                <span>Новое сообщение</span>
                <span class="next">Далее</span>
            </div>
            <div class="search-peaple">
                <p class="who">Кому: </p>
                <input class="look_for" type="text" placeholder="Поиск...">
            </div>
            <div class="choose">
                <p>Рекомендуемые</p>
                <ul class="list-human">
                </ul>
            </div>
        </div>
    </div>
    `;
    }

    private usersIdArr: string[] = [];

    private initFollowersAndSubscribtions(): void {
        this.$observer.emit(EventType.INIT_OPEN_MODAL, {}, (data: (ISubscription & IFollower)[]) => {
            data.forEach((val) => {
                this.addUser(val.avatar, val.nickName, val.userID);
            });
        });
    }

    private listHumanArr: HTMLElement[] = [];
    private addUser(avatarsUrl: string | undefined, name: string, userID: string): void {
        const html = `
        <li class="list-item" user-id="${userID}">
            <img class="userPhoto" src="${avatarsUrl}" alt="userPhoto">
            <span class="userName">${name}</span>
            <span class="circule"></span>
        </li>
    `;
        if (this.listHuman === null) return;
        this.listHuman?.insertAdjacentHTML('afterbegin', html);
        this.listHuman?.addEventListener('click', this.addActive);
        this.listHumanArr.push(this.listHuman);
    }

    private addActive = (e: Event) => {
        if (!(e.target instanceof HTMLElement)) return;
        const target = e.target;

        const up = target.closest('.list-item');
        if (up === null) return;

        const recepientId = up.getAttribute('user-id');
        if (recepientId === null) return;

        up.querySelector('.circule')?.classList.toggle('active');
        const input: HTMLInputElement | null | undefined = this.root?.querySelector('.look_for');
        if (!(input instanceof HTMLInputElement)) return;
        const textName = up.querySelector('.userName')?.textContent;
        if (textName !== undefined && textName !== null) {
            input.value = textName;
        }

        this.usersIdArr.push(recepientId);
    };

    private onClickBtnNext = (event: Event) => {
        if (event.target instanceof HTMLElement) {
            if (event.target.closest('.wrapper-overflow')) {
                this.$observer.emit(EventType.CREATE_CHAT_ROOM, this.usersIdArr);
                this.selfDestroy();
            }
        }
    };

    private onCloseModal = (e: Event) => {
        if (e.target instanceof HTMLElement) {
            if (e.target.classList.contains('wrapper-overflow')) {
                this.selfDestroy();
            }
        }
    };

    private selfDestroy(): void {
        this.listHumanArr.forEach((elem) => {
            elem.removeEventListener('click', this.addActive);
        });
        this.listHumanArr = [];
        this.disable();
        this.root?.remove();
    }
}

export default ModalWindow;
