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

    public execute(): void {
        this.getPost();
    }

    private async getPost(): Promise<void> {
        const userID = UserState.instance.UserID as string;
        const postID = UserState.instance.PostsID[0];
        // const post: IPosts | boolean = await PostsService.instance.getPost(postID);
        // if (typeof post === 'boolean') return;
        const posts: IPosts[] | boolean = await PostsService.instance.getAllPosts();
        if (typeof posts === 'boolean') return;
        for (let i = 0; i < posts.length; i++) {
            const post = posts[i];
            if (post.userID === userID) {
                this.observer.emit('eventPost', post);
            }
        }

        // window.location.href = '#/profile';
    }
}

export default PostModel;
