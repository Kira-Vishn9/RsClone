import Base from '../../app/base/Base';

class Home extends Base {
    public mount(): void {
        console.log('HOME: MOUNT');
    }

    public unmount(): void {
        console.log('HOME: UNMOUNT');
    }

    public render(): string {
        return 'HOME'.trim();
    }
}

export default Home;
