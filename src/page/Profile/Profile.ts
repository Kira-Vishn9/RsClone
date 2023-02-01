import Base from '../../app/base/Base';

class Profile extends Base {
    public mount(): void {
        console.log('Profile: MOUNT');
    }
    public unmount(): void {
        console.log('Profile: UNMOUNT');
    }
    public render(): string {
        return `Profile`.trim();
    }
}

export default Profile;
