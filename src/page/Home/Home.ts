import Base from '../../app/base/Base';
import HomeView from './view/HomeView';

class Home extends Base {
    private view: HomeView = new HomeView();

    public mount(): void {
        console.log('HOME: MOUNT');
        this.view.init();
    }

    public unmount(): void {
        console.log('HOME: UNMOUNT');
        this.view.unmount();
    }

    public render(): string {
        return this.view.make();
    }
}

export default Home;
