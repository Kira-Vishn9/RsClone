import Observer from '../../../app/observer/Observer';
import IFollower from '../../../firebase/model/IFollower';
import IPosts from '../../../firebase/model/IPosts';
import ISubscription from '../../../firebase/model/ISubscription';
import IUser from '../../../firebase/model/IUser';
import Posts from '../../../firebase/posts/posts';
import PostsService from '../../../firebase/service/PostsService';
import { LocalStorage } from '../../../localStorage/localStorage';
import PopupPost from '../../Home/popupPost';
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

        this.root.addEventListener('click', this.openPost);

        this.profileHead.BtnSubscriptions?.addEventListener('click', this.onBtnSub);
        this.profileHead.BtnFollowers?.addEventListener('click', this.onOpenModalFollowers);
        this.profileHead.BtnLogOut?.addEventListener('click', this.onBtnLogOut);
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
        this.profileHead.BtnLogOut?.removeEventListener('click', this.onBtnLogOut);
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
        // console.log('BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB', event);

        event.forEach((post: IPosts) => {
            const createPost = makePost(post.fileURL, post.likesUsers.length, post.comments.length, post.postID);
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
            this.ava(arg);
        });
    };

    private async ava(arg: string) {
        const post = await Posts.init.getAllPosts();
        post.forEach((item) => {
            if (item.userID === LocalStorage.instance.getUser().id) {
                PostsService.instance.updatePosts(item.postID, { avatar: arg });
            }
            const commentArr = item.comments;
            const updateArr = commentArr.map((com) => {
                if (com.nickName === LocalStorage.instance.getAuthor().nickName) {
                    com.avatar = arg;
                }
                return com;
            });
            PostsService.instance.updatePosts(item.postID, { comments: updateArr });
        });
    }

    private onSettings = () => {
        window.location.href = '#/settings';
    };

    private openPost = (e: Event) => {
        if (e.target instanceof HTMLElement) {
            const postBlock = e.target.closest('.item__profile');
            if (postBlock) {
                const popup = new PopupPost();
                popup.mount(postBlock.id);
            }
        }
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
        this.$observer.emit(EventType.OPEN_MODAL_FOLLOWERS, {}, (data: IFollower[]) => {
            const modal = new SubFollModal(this.$observer);
            this.root?.insertAdjacentHTML('afterend', modal.render());
            modal.init();

            data.forEach((sub: IFollower) => {
                modal.makeItem(sub.avatar, sub.fullname, sub.nickName, sub.id, sub.userID);
            });
        });
    };

    private onBtnLogOut = () => {
        // console.log('LOGOUT');
        this.$observer.emit(EventType.CLICK_BTN_LOG_OUT, {});
    };
}

export default ProfileView;
