import Observer from '../../../app/observer/Observer';
import IPosts from '../../../firebase/model/IPosts';
import IUser from '../../../firebase/model/IUser';
import PullPushImg from '../../../firebase/pull-push-img/PullPushImg';
import PostsService from '../../../firebase/service/PostsService';
import UserService from '../../../firebase/service/UserSevice';
import userState from '../../../state/user.state';
import UserState from '../../../state/UserState';

class ProfileModel {
    private observer: Observer;

    public constructor(observer: Observer) {
        this.observer = observer;
    }

    public execute(): void {
        this.getUser();
        this.getPost();

        this.enable();
    }

    public enable(): void {
        this.observer.subscribe('eventChangeAvatar', this.onChangeAvatar);
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
        for (let i = 0; i < posts.length; i++) {
            const post = posts[i];
            if (post.userID === userID) {
                // postsUser.push(post);
                this.observer.emit('eventPost', post);
            }
        }

        // const allSocial = {
        //     publication: 0,
        //     subscribers: 0,
        //     subscriptions: 0,
        // };

        // for (let i = 0; i < postsUser.length; i++) {
        //     const post = postsUser[i];
        //     allSocial.publication = post.
        // }

        window.location.href = '#/profile'; // << Костыль Типо >> Ререндер
    }

    private async getUser(): Promise<void> {
        const userID = UserState.instance.UserID;
        if (userID === null) return;

        const user: IUser | null = await UserService.instance.getUser(userID);
        if (user === null) return;

        this.observer.emit('eventUser', user);
    }

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
}

export default ProfileModel;
