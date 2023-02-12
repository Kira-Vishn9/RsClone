import Observer from '../../../app/observer/Observer';
import IPosts from '../../../firebase/model/IPosts';
import IUser from '../../../firebase/model/IUser';
import ProfileHeadComponent from '../components/ProfileHeadComponent';
import '../style/profile.scss';
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
        this.profileHead.InputAvatar?.addEventListener('change', this.onChangeAvatar);
        this.profileHead.BtnSettings?.addEventListener('click', this.onSettings);
    }

    public unmount(): void {
        this.$observer.unsubscribe('eventUser', this.onGetUser);
        this.$observer.unsubscribe('eventPost', this.onGetPost);
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
        const nickName = event.nikName;
        this.profileHead.changeFullName(fullname);
        console.log('FULLNAME: ' + fullname);
        this.profileHead.changeNickName(nickName);

        if (event.avatar !== undefined) this.profileHead.changeAvatar(event.avatar);
    };

    private onGetPost = (event: IPosts) => {
        console.log('ProfileView');
        console.log(event);

        const createPost = makePost(event.fileURL);
        // this.profileHead?.changeName(event.author.nickName);
        // this.profileHead.changeFullName(event.author.fullname);
        this.postContainer?.insertAdjacentHTML('afterbegin', createPost);
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
}

export default ProfileView;
