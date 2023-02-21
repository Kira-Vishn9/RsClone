import Observer from '../../../app/observer/Observer';
import IPosts from '../../../firebase/model/IPosts';
import ISubscription from '../../../firebase/model/ISubscription';
import IUser from '../../../firebase/model/IUser';
import FollowersService from '../../../firebase/service/FollowersService';
import PostsService from '../../../firebase/service/PostsService';
import SubscriptionsService from '../../../firebase/service/SubscriptionsService';
import UserService from '../../../firebase/service/UserSevice';
import UserState from '../../../state/UserState';
import EventType from '../types/EventType';

class AnotherProfileModel {
    private $observer: Observer;
    private userID: string = '';

    public constructor(observer: Observer) {
        this.$observer = observer;
    }

    public mount(): void {
        this.getUser();
        this.getPost();
        this.getSubscriptions();
        this.getFollowers();
        this.$observer.subscribe(EventType.SUB_UNSUB, this.onSubUnSub);
    }

    public unmount(): void {
        this.$observer.unsubscribe(EventType.SUB_UNSUB, this.onSubUnSub);
    }

    private async getPost(): Promise<void> {
        const userID = UserState.instance.AnotherUserID as string;
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

        this.$observer.emit('eventPost', postArr);

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
        const userID = UserState.instance.AnotherUserID;
        this.userID = userID as string;

        if (userID === null) return;

        const user: IUser | null = await UserService.instance.getUser(userID);
        if (user === null) return;
        this.$observer.emit('eventUser', user);
    }

    private async getSubscriptions(): Promise<void> {
        const userID = UserState.instance.AnotherUserID;
        if (userID === null) return;
        // const data = await UserService.instance.getSubscriptions(userID);
        const data = await SubscriptionsService.instance.getSubscriptions(userID);
        if (data === null) return;
        this.$observer.emit(EventType.INIT_SUBSCRIPTIONS, data);
    }

    private async getFollowers(): Promise<void> {
        const userID = UserState.instance.AnotherUserID;
        if (userID === null) return;
        const data = await FollowersService.instance.getFollowers(userID);
        if (data === null) return;

        this.$observer.emit(EventType.INIT_FOLLOWERS, data);
    }

    private onSubUnSub = (sub: ISubscription) => {
        const userID = UserState.instance.UserID;
        if (userID === null) return;
        sub.userID = this.userID;
        // UserService.instance.setSubscriptions(userID, sub, false);
        SubscriptionsService.instance.setSubscriptions(userID, sub);
    };
}

export default AnotherProfileModel;
