import { FirebaseError } from 'firebase/app';
import Observer from '../../../app/observer/Observer';
import IPosts from '../../../firebase/model/IPosts';
import ISubscription from '../../../firebase/model/ISubscription';
import IUser from '../../../firebase/model/IUser';
import FollowersService from '../../../firebase/service/FollowersService';
import PostsService from '../../../firebase/service/PostsService';
import SubscriptionsService from '../../../firebase/service/SubscriptionsService';
import UserService from '../../../firebase/service/UserSevice';
import { LocalStorage } from '../../../localStorage/localStorage';
import UserState from '../../../state/UserState';
import anotherKeyID from '../common/local.storage.key';
import AnotherEventType from '../types/AnotherEventType';
import EventType from '../types/EventType';
import SubscribedType from '../types/SubscribedType';

class AnotherProfileModel {
    private $observer: Observer;
    private userID: string = '';

    public constructor(observer: Observer) {
        this.$observer = observer;
    }

    public mount(): void {
        this.getUser();

        this.$observer.subscribe(EventType.SUB_UNSUB, this.onSubscriptions);
        // this.$observer.subscribe(EventType.MODAL_UNSUBSCRIPTIONS, this.onUnsubScriptions);
        this.$observer.subscribe(AnotherEventType.BUTTON_CLICK_UNSUBSCRIBE, this.onUnsubScriptions);
        this.$observer.subscribe(AnotherEventType.BUTTON_CLICK_SUBSCRIBE, this.onSubscriptions);
    }

    public unmount(): void {
        this.$observer.unsubscribe(EventType.SUB_UNSUB, this.onSubscriptions);
        // this.$observer.unsubscribe(EventType.MODAL_UNSUBSCRIPTIONS, this.onUnsubScriptions);
        this.$observer.unsubscribe(AnotherEventType.BUTTON_CLICK_UNSUBSCRIBE, this.onUnsubScriptions);
        this.$observer.unsubscribe(AnotherEventType.BUTTON_CLICK_SUBSCRIBE, this.onSubscriptions);
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
        // let anotherID = LocalStorage.instance.getData(anotherKeyID);
        // console.log('ANOTHERIDV2:: ', anotherID);
        // if (anotherID === null) return;
        // UserState.instance.AnotherUserID = anotherID;
        const myID = UserState.instance.UserID;
        let userID = UserState.instance.AnotherUserID;
        console.log('MYID:: ', myID);
        if (myID === null) return;

        if (userID === null) {
            let anotherID = LocalStorage.instance.getData(anotherKeyID);
            if (anotherID === null) return;
            UserState.instance.AnotherUserID = anotherID;
            userID = UserState.instance.AnotherUserID;
            if (userID === null) return;
        }

        const user: IUser | null = await UserService.instance.getUser(userID);

        if (user === null) return;

        const data: SubscribedType = {
            user: user,
            subscribed: null,
        };

        if (myID !== null) {
            const find = await SubscriptionsService.instance.findSubscraptions(myID, userID);

            if (!(find instanceof FirebaseError)) data.subscribed = find;
        }

        this.$observer.emit('eventUser', data);

        this.getPost();
        this.getSubscriptions();
        this.getFollowers();
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

    private onSubscriptions = async (sub: ISubscription, cb?: () => void) => {
        console.log('kekt:', sub);
        const userID = UserState.instance.UserID;
        console.log('kektV2:', sub);
        if (userID === null) return;
        console.log('kektV3:', sub);

        // sub.userID = this.userID;
        console.log('jifdgjhgfjhgfdjh', sub);
        console.log('kektV4:', sub);

        // UserService.instance.setSubscriptions(userID, sub, false);
        await SubscriptionsService.instance.setSubscriptions(userID, sub, async () => {
            // const findUser = await SubscriptionsService.instance.findSubscraptions(userID, sub.userID);
            // if (findUser === null) {
            //     console.log('Такого Юзера Нету!!');
            // } else {
            //     console.log('Такой Юзер Есть!!');
            // }
            if (cb !== undefined) {
                cb();
            }
        });
    };

    private onUnsubScriptions = async (subID: string, cb?: () => void) => {
        // UserService.instance.deleteSubscriptions(subID);
        const userID = UserState.instance.UserID;
        if (userID === null) return;

        const subId = await SubscriptionsService.instance.getSubscriptions(userID);
        if (subId === null) return;
        const find = subId?.find((sub) => sub.userID === subID);
        if (find === undefined || find.id === undefined) return;

        await SubscriptionsService.instance.deleteSubscriptions(userID, find.id);

        if (cb !== undefined) {
            cb();
        }
    };
}

export default AnotherProfileModel;
