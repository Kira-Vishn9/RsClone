import Base from '../../app/base/Base';
import Observer from '../../app/observer/Observer';
import PostModel from './model/PostModel';
import ProfileView from './view/ProfileView';

class Profile extends Base {
    private observer: Observer = new Observer();
    private view: ProfileView = new ProfileView(this.observer);
    private postModel: PostModel = new PostModel(this.observer);

    public mount(): void {
        console.log('Profile: MOUNT');
        this.view.init();
        this.postModel.init();
    }

    public unmount(): void {
        console.log('Profile: UNMOUNT');
        this.view.unmount();
    }

    public render(): string {
        return this.view.make();
    }
}

export default Profile;
