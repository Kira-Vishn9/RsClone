import Observer from '../../../app/observer/Observer';
import IPosts from '../../../firebase/model/IPosts';
import IUser from '../../../firebase/model/IUser';
import '../style/profile.scss';
import dataProfile from '../ui/data-profile';
import dataProfileTop from '../ui/data.profile.top';
import makePost from '../ui/item-profile';

class ProfileView {
    private $observer: Observer;
    private root: HTMLElement | null = null;
    private postContainer: HTMLElement | null = null;

    public constructor(observer: Observer) {
        this.$observer = observer;
    }

    public init(): void {
        this.root = document.querySelector('.profile');
        if (this.root === null) return;

        this.postContainer = this.root.querySelector('.items-grid__profile');
        this.$observer.subscribe('eventPost', this.onPost);
    }

    public unmount(): void {
        this.$observer.unsubscribe('eventPost', this.onPost);
    }

    public make(): string {
        return `
            <section class="profile">

                <div class="data__profile">
                    <img src="https://kipmu.ru/wp-content/uploads/jptr-1.jpg">
                    <div>
                        ${dataProfileTop('Jupiter')}
                        ${dataProfile(154, 147, 577)}
                        <span>Jupiter Sprogiba</span>
                    </div>
                </div>

                <div class="items-grid__profile">
                    
                </div>
            </section>
        `.trim();
    }

    private onPost = (event: IPosts) => {
        console.log('ProfileView');
        console.log(event);
        debugger;

        const { fileURL } = event;
        // const test: string = event.fileURL;
        // const tt: IPosts = event;
        // const blabla = tt.fileURL;
        // debugger;
        const createPost = makePost(fileURL);
        // debugger;
        console.log(createPost);
        this.postContainer?.insertAdjacentHTML('afterbegin', createPost);
    };
}

export default ProfileView;
