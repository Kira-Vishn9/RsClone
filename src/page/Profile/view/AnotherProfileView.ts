import Observer from '../../../app/observer/Observer';
import IPosts from '../../../firebase/model/IPosts';
import ISubscription from '../../../firebase/model/ISubscription';
import IUser from '../../../firebase/model/IUser';
import { LocalStorage } from '../../../localStorage/localStorage';
import UserState from '../../../state/UserState';
import anotherKeyID from '../common/local.storage.key';
import AnotherProfileHeadComponent from '../components/AnotherProfileHeadComponent';
import AnotherEventType from '../types/AnotherEventType';
import EventType from '../types/EventType';
import SubscribedType from '../types/SubscribedType';
import makePost from '../ui/item-profile';

class AnotherProfileView {
    private $observer: Observer;
    private root: HTMLElement | null = null;
    private postContainer: HTMLElement | null = null;

    private profileHead: AnotherProfileHeadComponent = new AnotherProfileHeadComponent();

    public get Root() {
        return this.root;
    }

    public constructor(observer: Observer) {
        this.$observer = observer;
    }

    public init(): void {
        this.root = document.querySelector('.profile');
        if (this.root === null) return;

        this.postContainer = this.root.querySelector('.items-grid__profile');

        this.$observer.subscribe('eventUser', this.onGetUser);
        this.$observer.subscribe('eventPost', this.onGetPost);
        this.$observer.subscribe(EventType.INIT_SUBSCRIPTIONS, this.onGetSubscriptions);
        this.$observer.subscribe(EventType.INIT_FOLLOWERS, this.onGetFollowers);
    }

    public unmount(): void {
        this.$observer.unsubscribe('eventUser', this.onGetUser);
        this.$observer.unsubscribe('eventPost', this.onGetPost);
        this.$observer.unsubscribe(EventType.INIT_SUBSCRIPTIONS, this.onGetSubscriptions);
        this.$observer.unsubscribe(EventType.INIT_FOLLOWERS, this.onGetFollowers);

        this.profileHead.BtnSubUnSub?.removeEventListener('click', this.onSubUnSub);
    }

    public make(): string {
        return `
            <section class="profile">


                <div class="items-grid__profile">


                </div>
            </section>
        `.trim();
    }

    private onGetUser = (event: SubscribedType) => {
        console.log('adsadasdad');
        console.log(event.user.id);
        if (this.root === null) return;
        if (event.user.id === undefined) return;
        const avatars = event.user.avatar;
        const fullname = event.user.name;
        const nickName = event.user.nickName;
        console.log('event', event.user);
        LocalStorage.instance.setData(anotherKeyID, event.user.id);
        if (event.subscribed === null) {
            this.root.insertAdjacentHTML(
                'afterbegin',
                this.profileHead.make(avatars, fullname, nickName, 'Подписаться', event.user.id)
            );

            this.profileHead.init(this.root);
            this.profileHead.BtnSubUnSub?.addEventListener('click', this.onSubUnSub);
        } else {
            this.root.insertAdjacentHTML(
                'afterbegin',
                this.profileHead.make(avatars, fullname, nickName, 'Отписаться', event.user.id)
            );
            this.profileHead.init(this.root);
            this.profileHead.BtnSubUnSub?.addEventListener('click', this.onSubUnSub);
        }

        // this.profileHead.changeFullName(fullname);

        // this.profileHead.changeNickName(nickName);
        // if (event.avatar !== undefined) this.profileHead.changeAvatar(event.avatar);
    };

    private onSubscribed = (data: ISubscription) => {
        // if (this.root === null) return;
        // if (data) {
        //     this.root.insertAdjacentHTML(
        //         'afterbegin',
        //         this.profileHead.make(this.fullName, this.nickName, 'Отписаться')
        //     );
        // } else {
        //     this.root.insertAdjacentHTML(
        //         'afterbegin',
        //         this.profileHead.make(this.fullName, this.nickName, 'Подписаться')
        //     );
        // }
    };

    private onGetPost = (event: IPosts[]) => {
        event.forEach((post: IPosts) => {
            const createPost = makePost(post.fileURL, post.likesUsers.length, post.comments.length, post.postID);
            this.postContainer?.insertAdjacentHTML('afterbegin', createPost);
        });
        this.profileHead.changeAmountPublications(event.length);
    };

    private onGetSubscriptions = (data: ISubscription[]) => {
        this.profileHead.changeAmountSubscriptions(data.length);
    };

    private onGetFollowers = (data: ISubscription[]) => {
        this.profileHead.changeAmountFollowers(data.length);
    };

    // Кнопка Подписка отписка
    private onSubUnSub = () => {
        if (this.profileHead.checkBtnState === null) return;
        if (this.profileHead.checkBtnState()) {
            this.btnUnsubscribe();
        } else {
            this.btnSubscribe();
        }
        // const fullName = this.profileHead.Fullname;
        // const name = this.profileHead.Name;
        // if (fullName === null || name === null) return;
        // if (fullName === undefined || name === undefined) return;
        // if (this.profileHead.BtnSubUnSub !== null) {
        //     this.profileHead.BtnSubUnSub.disabled = true;
        // }
        // const sub: ISubscription = {
        //     fullname: fullName,
        //     nickName: name,
        //     userID: '', // << Костыль запись ID Происходит в model
        //     avatar: this.profileHead.ImgAvatar === undefined ? '' : this.profileHead.ImgAvatar,
        // };
        // console.log(this.profileHead.checkSubUnSub());
        // if (this.profileHead.checkSubUnSub() !== null && this.profileHead.checkSubUnSub()) {
        //     console.log(UserState.instance.AnotherUserID);
        //     this.$observer.emit(
        //         EventType.MODAL_UNSUBSCRIPTIONS,
        //         UserState.instance.AnotherUserID,
        //         (isUnSub: boolean) => {
        //             //
        //         }
        //     );
        // } else {
        //     this.$observer.emit(EventType.SUB_UNSUB, sub, (isSub: boolean) => {
        //         if (isSub) {
        //             this.profileHead.btnSubUnSubDisable();
        //         } else {
        //             this.profileHead.btnSubUnSubEnable();
        //         }
        //     });
        // }
    };

    // Кнопка Отписки
    private btnUnsubscribe(): void {
        console.log('Нажата Отпска');
        if (this.profileHead.UserID === null) return;
        this.$observer.emit(AnotherEventType.BUTTON_CLICK_UNSUBSCRIBE, this.profileHead.UserID, () => {
            this.profileHead.btnSubscribed();
        });
    }

    // Кнопка Подписки
    private btnSubscribe(): void {
        console.log('Нажата Подписка');
        const fullName = this.profileHead.Fullname;
        const name = this.profileHead.Name;
        const id = this.profileHead.UserID;
        if (name === null) return;
        if (name === undefined) return;
        if (fullName === null) return;
        if (fullName === undefined) return;
        if (id === null) return;

        const sub: ISubscription = {
            fullname: fullName,
            nickName: name,
            userID: id,
            avatar: this.profileHead.ImgAvatar === undefined ? '' : this.profileHead.ImgAvatar,
        };
        console.log('534534789553');
        const btn = this.profileHead.BtnSubUnSub;
        if (btn === null) return;
        btn.disabled = true;
        console.log('agagaggaga', sub);

        this.$observer.emit(AnotherEventType.BUTTON_CLICK_SUBSCRIBE, sub, () => {
            this.profileHead.btnUnSubscribed();
            btn.disabled = false;
        });
    }
}

export default AnotherProfileView;
