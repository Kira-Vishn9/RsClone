import Observer from '../../../app/observer/Observer';
import IPosts from '../../../firebase/model/IPosts';
import ISubscription from '../../../firebase/model/ISubscription';
import IUser from '../../../firebase/model/IUser';
import AnotherProfileHeadComponent from '../components/AnotherProfileHeadComponent';
import EventType from '../types/EventType';
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
        this.profileHead.init(this.root);

        this.postContainer = this.root.querySelector('.items-grid__profile');

        this.$observer.subscribe('eventUser', this.onGetUser);
        this.$observer.subscribe('eventPost', this.onGetPost);
        this.$observer.subscribe(EventType.INIT_SUBSCRIPTIONS, this.onGetSubscriptions);
        this.$observer.subscribe(EventType.INIT_FOLLOWERS, this.onGetFollowers);

        this.profileHead.BtnSubUnSub?.addEventListener('click', this.onSubUnSub);
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

                ${this.profileHead.make()}

                <div class="items-grid__profile">
                    
                </div>
            </section>
        `.trim();
    }

    private onGetUser = (event: IUser) => {
        const fullname = event.name;
        const nickName = event.nickName;

        this.profileHead.changeFullName(fullname);

        this.profileHead.changeNickName(nickName);

        if (event.avatar !== undefined) this.profileHead.changeAvatar(event.avatar);
    };

    private onGetPost = (event: IPosts[]) => {
        event.forEach((post: IPosts) => {
            const createPost = makePost(post.fileURL);
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

    private onSubUnSub = () => {
        const fullName = this.profileHead.Fullname;
        const name = this.profileHead.Name;
        if (fullName === null || name === null) return;
        if (fullName === undefined || name === undefined) return;

        const sub: ISubscription = {
            fullname: fullName,
            nickName: name,
            userID: '', // << Костыль запись ID Происходит в model
            avatar: this.profileHead.ImgAvatar === undefined ? '' : this.profileHead.ImgAvatar,
        };

        this.$observer.emit(EventType.SUB_UNSUB, sub);
    };
}

export default AnotherProfileView;
