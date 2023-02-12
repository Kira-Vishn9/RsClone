import Base from '../../app/base/Base';
import Observer from '../../app/observer/Observer';
import ProfileModel from './model/ProfileModel';
import ProfileView from './view/ProfileView';

class Profile extends Base {
    private observer: Observer = new Observer();
    private view: ProfileView = new ProfileView(this.observer);
    private postModel: ProfileModel = new ProfileModel(this.observer);

    public mount(): void {
        console.log('Profile: MOUNT');
        this.view.init();
        this.postModel.execute();
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
