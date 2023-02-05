import Base from '../../app/base/Base';
import AccountView from './view/AccountView';

class Account extends Base {
    private view: AccountView = new AccountView();

    public mount(): void {
        console.log('ACCOUNT: MOUNT');
        this.view.init();
    }

    public unmount(): void {
        console.log('ACCOUNT: UNMOUNT');
        this.view.unmount();
    }

    public render(): string {
        return this.view.make();
    }
}

export default Account;
