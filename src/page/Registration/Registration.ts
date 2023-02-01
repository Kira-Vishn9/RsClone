import Base from '../../app/base/Base';

class Registration extends Base {
    public mount(): void {
        console.log('Registration: MOUNT');
    }

    public unmount(): void {
        console.log('Registration: UNMOUNT');
    }

    public render(): string {
        return 'REGISTRATION'.trim();
    }
}

export default Registration;
