import Observer from '../../../app/observer/Observer';
import IFollower from '../../../firebase/model/IFollower';
import IPosts from '../../../firebase/model/IPosts';
import ISubscription from '../../../firebase/model/ISubscription';
import IUser from '../../../firebase/model/IUser';
import ProfileHeadComponent from '../components/ProfileHeadComponent';
import SubFollModal from '../modals/SubFollModal';
import '../style/profile.scss';
import EventType from '../types/EventType';
import makePost from '../ui/item-profile';

class ProfileView {
    private $observer: Observer;
    private root: HTMLElement | null = null;
    private postContainer: HTMLElement | null = null;

    private profileHead: ProfileHeadComponent = new ProfileHeadComponent();

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
        this.profileHead.InputAvatar?.addEventListener('change', this.onChangeAvatar);
        this.profileHead.BtnSettings?.addEventListener('click', this.onSettings);
        this.profileHead.BtnSubscriptions?.addEventListener('click', this.onBtnSub);
        this.profileHead.BtnFollowers?.addEventListener('click', this.onOpenModalFollowers);
    }

    public unmount(): void {
        this.$observer.unsubscribe('eventUser', this.onGetUser);
        this.$observer.unsubscribe('eventPost', this.onGetPost);
        this.$observer.unsubscribe(EventType.INIT_SUBSCRIPTIONS, this.onGetSubscriptions);
        this.$observer.unsubscribe(EventType.INIT_FOLLOWERS, this.onGetFollowers);

        this.profileHead.InputAvatar?.removeEventListener('change', this.onChangeAvatar);
        this.profileHead.BtnSettings?.removeEventListener('click', this.onSettings);
        this.profileHead.BtnSubscriptions?.removeEventListener('click', this.onBtnSub);
        this.profileHead.BtnFollowers?.removeEventListener('click', this.onOpenModalFollowers);
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
        console.log('NICK:' + event.nickName);
        this.profileHead.changeFullName(fullname);
        console.log('FULLNAME: ' + fullname);
        this.profileHead.changeNickName(nickName);

        if (event.avatar !== undefined) this.profileHead.changeAvatar(event.avatar);
    };

    private onGetPost = (event: IPosts[]) => {
        console.log('ProfileView');
        console.log(event);

        event.forEach((post: IPosts) => {
            const createPost = makePost(post.fileURL);
            this.postContainer?.insertAdjacentHTML('afterbegin', createPost);
        });

        this.profileHead.changeAmountPublications(event.length);

        // this.profileHead?.changeName(event.author.nickName);
        // this.profileHead.changeFullName(event.author.fullname);
    };

    private onGetSubscriptions = (data: ISubscription[]) => {
        this.profileHead.changeAmountSubscriptions(data.length);
    };

    private onGetFollowers = (data: ISubscription[]) => {
        this.profileHead.changeAmountFollowers(data.length);
    };

    private onChangeAvatar = (event: Event) => {
        if (!(event.target instanceof HTMLInputElement)) return;
        const file = event.target.files;
        if (file === null) return;
        this.$observer.emit('eventChangeAvatar', file[0], (arg: string) => {
            this.profileHead.changeAvatar(arg);
        });
    };

    private onSettings = () => {
        window.location.href = '#/settings';
    };

    // modal
    private onBtnSub = () => {
        this.$observer.emit(EventType.SUBSCRIPTIONS, {}, (data: ISubscription[]) => {
            const modal = new SubFollModal(this.$observer);
            this.root?.insertAdjacentHTML('afterend', modal.render());
            modal.init();

            data.forEach((sub: ISubscription) => {
                modal.makeItem(sub.avatar, sub.fullname, sub.nickName, sub.id, sub.userID);
            });
        });
    };

    private onOpenModalFollowers = () => {
        console.log('aaa');
        this.$observer.emit(EventType.OPEN_MODAL_FOLLOWERS, {}, (data: IFollower[]) => {
            const modal = new SubFollModal(this.$observer);
            this.root?.insertAdjacentHTML('afterend', modal.render());
            modal.init();

            data.forEach((sub: IFollower) => {
                modal.makeItem(sub.avatar, sub.fullname, sub.nickName, sub.id, sub.userID);
            });
        });
    };
}

export default ProfileView;
