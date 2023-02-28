import Observer from '../../../app/observer/Observer';
import IUser from '../../../firebase/model/IUser';
import { LocalStorage } from '../../../localStorage/localStorage';
import UserState from '../../../state/UserState';
import '../style/search.scss';
import EventType from '../types/EventType';
import addUsersInBlock from '../ui/addUsers';
import searchUser from '../ui/searchUser';

class SearchView {
    private $observer: Observer;
    private root: HTMLElement | null = null;
    private searchList: HTMLElement | null = null;

    public constructor(observer: Observer) {
        this.$observer = observer;
    }

    public init(): void {
        this.root = document.querySelector('.search');
        if (this.root === null) return;
        this.searchList = this.root.querySelector('.search__main');
        this.$observer.subscribe(EventType.GET_ALL_USER, this.onGetAllUser);
        this.searchList?.addEventListener('click', this.onUserClick);
    }

    // async addSearchUsers() {
    //     this.searchList?.insertAdjacentHTML('beforeend', await addUsersInBlock());
    // }

    public unmount(): void {
        this.$observer.unsubscribe(EventType.GET_ALL_USER, this.onGetAllUser);
        this.searchList?.removeEventListener('click', this.onUserClick);
    }

    public make(): string {
        return `
            <div class="search">
                <div class="search__header">
                    <input class="search__header-input" type="search" placeholder="Search">
                </div>
                <div class="search__main">
                </div>
            </div>
    `.trim();
    }

    private onGetAllUser = (users: IUser[]) => {
        if (this.searchList === null) return;
        this.searchList.innerHTML = '';

        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            const localId = LocalStorage.instance.getUser().id;
            if (user.id === localId) continue;
            if (user.id === undefined) continue;
            this.searchList?.insertAdjacentHTML(
                'beforeend',
                searchUser(user.nickName, user.name, user.id, user.avatar)
            );
        }
    };

    private onUserClick = (event: Event) => {
        if (!(event.target instanceof HTMLElement)) return;
        const target = event.target;
        const rootElem = target.closest('.search-user');
        if (rootElem === null) return;

        const userID = rootElem.getAttribute('user-id');
        const nickName = rootElem.querySelector('.search-title');
        if (userID !== null) {
            //UserState.instance.setUserID(userID);
            UserState.instance.AnotherUserID = userID;
            window.location.hash = `#/profile/${nickName?.textContent}`; // << Еще 1ин Костыль
            // window.location.hash = `#/profile/${userID}`; // << Еще 1ин Костыль
        }
    };
}

export default SearchView;
