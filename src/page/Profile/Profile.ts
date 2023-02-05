import Base from '../../app/base/Base';
import ProfileView from './view/ProfileView';

class Profile extends Base {
    private view: ProfileView = new ProfileView();

    public mount(): void {
        console.log('Profile: MOUNT');
        this.view.init();
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
