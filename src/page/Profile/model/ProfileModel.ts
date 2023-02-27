import Observer from '../../../app/observer/Observer';
import Auth from '../../../firebase/auth/Auth';
import IFollower from '../../../firebase/model/IFollower';
import IPosts from '../../../firebase/model/IPosts';
import ISubscription from '../../../firebase/model/ISubscription';
import IUser from '../../../firebase/model/IUser';
import PullPushImg from '../../../firebase/pull-push-img/PullPushImg';
import FollowersService from '../../../firebase/service/FollowersService';
import PostsService from '../../../firebase/service/PostsService';
import SubscriptionsService from '../../../firebase/service/SubscriptionsService';
import UserService from '../../../firebase/service/UserSevice';
import { LocalStorage } from '../../../localStorage/localStorage';
import UserState from '../../../state/UserState';
import EventType from '../types/EventType';

class ProfileModel {
    private observer: Observer;

    public constructor(observer: Observer) {
        this.observer = observer;
    }

    public mount(): void {
        this.getUser();
        this.getPost();
        this.getSubscriptions();
        this.getFollowers();
        this.observer.subscribe('eventChangeAvatar', this.onChangeAvatar);
        this.observer.subscribe(EventType.SUBSCRIPTIONS, this.onGetSubscriptions);
        this.observer.subscribe(EventType.MODAL_UNSUBSCRIPTIONS, this.onUnsubScriptions);
        this.observer.subscribe(EventType.OPEN_MODAL_FOLLOWERS, this.onGetFollowersForModal);
        this.observer.subscribe(EventType.CLICK_BTN_LOG_OUT, this.onLogOut);
    }

    public unmount(): void {
        this.observer.unsubscribe('eventChangeAvatar', this.onChangeAvatar);
        this.observer.unsubscribe(EventType.SUBSCRIPTIONS, this.onGetSubscriptions);
        this.observer.unsubscribe(EventType.MODAL_UNSUBSCRIPTIONS, this.onUnsubScriptions);
        this.observer.unsubscribe(EventType.OPEN_MODAL_FOLLOWERS, this.onGetFollowersForModal);
        this.observer.unsubscribe(EventType.CLICK_BTN_LOG_OUT, this.onLogOut);
    }

    private async getPost(): Promise<void> {
        const userID = UserState.instance.UserID as string;
        const postID = UserState.instance.PostsID[0];
        // const post: IPosts | boolean = await PostsService.instance.getPost(postID);
        // if (typeof post === 'boolean') return;
        // const user: IUser | null = await UserService.instance.getUser(userID);
        const posts: IPosts[] | boolean = await PostsService.instance.getAllPosts();
        // const postsUser: IPosts[] = []; // << Возможно для считывания всех лайков и тд
        if (typeof posts === 'boolean') return;
        const postArr: IPosts[] = [];
        for (let i = 0; i < posts.length; i++) {
            const post = posts[i];
            if (post.userID === userID) {
                // postsUser.push(post);
                postArr.push(post);
            }
        }
        console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', postArr);

        this.observer.emit('eventPost', postArr);

        // const allSocial = {
        //     publication: 0,
        //     subscribers: 0,
        //     subscriptions: 0,
        // };

        // for (let i = 0; i < postsUser.length; i++) {
        //     const post = postsUser[i];
        //     allSocial.publication = post.
        // }
    }

    private async getUser(): Promise<void> {
        const userID = UserState.instance.UserID;
        if (userID === null) return;

        const user: IUser | null = await UserService.instance.getUser(userID);
        if (user === null) return;
        this.observer.emit('eventUser', user);
    }

    private async getSubscriptions(): Promise<void> {
        const userID = UserState.instance.UserID;
        if (userID === null) return;
        const data = await SubscriptionsService.instance.getSubscriptions(userID);
        if (data === null) return;
        this.observer.emit(EventType.INIT_SUBSCRIPTIONS, data);
    }

    private async getFollowers(): Promise<void> {
        const userID = UserState.instance.UserID;
        if (userID === null) return;
        const data = await FollowersService.instance.getFollowers(userID);
        if (data === null) return;
        this.observer.emit(EventType.INIT_FOLLOWERS, data);
    }

    private onGetFollowersForModal = async (empty: object, cb?: (data: IFollower[]) => void) => {
        const userID = UserState.instance.UserID;
        if (userID === null) return;
        const data = await FollowersService.instance.getFollowers(userID);
        if (data === null) return;
        if (cb !== undefined) cb(data);
    };

    private onChangeAvatar = (file: File, cb?: (args: string) => void) => {
        const fileReader = new FileReader();
        fileReader.onload = async () => {
            const imgUrl = await PullPushImg.instance.uploadAvatar(file);
            if (typeof imgUrl === 'string') {
                if (cb !== undefined) cb(imgUrl);
            }
        };
        fileReader.readAsDataURL(file);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private onGetSubscriptions = async (empty: object, cb?: (val: ISubscription[]) => void) => {
        const userID = UserState.instance.UserID;
        if (userID === null) return;
        const data = await SubscriptionsService.instance.getSubscriptions(userID);
        if (data === null) return;
        if (cb !== undefined) cb(data);
    };

    private onUnsubScriptions = (subID: string) => {
        // UserService.instance.deleteSubscriptions(subID);
        const userID = UserState.instance.UserID;
        if (userID === null) return;
        console.log(subID);
        SubscriptionsService.instance.deleteSubscriptions(userID, subID);
        this.observer.emit(EventType.RERENDER, {});
    };

    // Выход из accounts
    private onLogOut = async () => {
        LocalStorage.instance.deleteData('another-profile-id');
        LocalStorage.instance.deleteData('author');
        LocalStorage.instance.deleteData('user');
        await Auth.instance.logOutAccount();
    };
}

export default ProfileModel;
