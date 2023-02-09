import Observer from '../../../app/observer/Observer';
import IPosts from '../../../firebase/model/IPosts';
import IUser from '../../../firebase/model/IUser';
import PullPushImg from '../../../firebase/pull-push-img/PullPushImg';
import PostsService from '../../../firebase/service/PostsService';
import UserService from '../../../firebase/service/UserSevice';
import userState from '../../../state/user.state';
import UserState from '../../../state/UserState';

class PostModel {
    private observer: Observer;

    private post: IPosts | null = null;

    public constructor(observer: Observer) {
        this.observer = observer;
    }

    public init(): void {
        this.getPost();
    }

    private async getPost(): Promise<void> {
        const userID = UserState.instance.UserID as string;
        console.log('USERID: ' + userID);
        const postID = UserState.instance.PostsID[0];
        console.log('POST: ' + postID);

        // const user: IUser | null = await UserService.instance.getUser(userID);
        const post: IPosts | boolean = await PostsService.instance.getPost(postID);
        console.log('POSTMODEL');
        console.log(post);
        if (typeof post === 'boolean') return;

        // const img = await PullPushImg.instance.getFile(post.fileName);
        console.log(typeof post);
        debugger;
        this.observer.emit('eventPost', post);
    }
}

export default PostModel;
