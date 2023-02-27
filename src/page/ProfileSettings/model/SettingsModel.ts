import Observer from '../../../app/observer/Observer';
import Auth from '../../../firebase/auth/Auth';
import IUser from '../../../firebase/model/IUser';
import UserService from '../../../firebase/service/UserSevice';
import { LocalStorage } from '../../../localStorage/localStorage';
import UserState from '../../../state/UserState';
import EventType from '../types/EventType';

class SettingsModel {
    private $observer: Observer;

    public constructor(observer: Observer) {
        this.$observer = observer;
    }

    public execute(): void {
        this.getUserData();

        this.$observer.subscribe(EventType.UPDATE_USER, this.onUpdateUserData);
    }

    public unmount(): void {
        this.$observer.unsubscribe(EventType.UPDATE_USER, this.onUpdateUserData);
    }

    private async getUserData(): Promise<void> {
        const userID = UserState.instance.UserID;
        if (userID === null) return;
        const user = await UserService.instance.getUser(userID);

        this.$observer.emit(EventType.GET_USER, user);
    }

    private onUpdateUserData = async (user: IUser) => {
        await UserService.instance.updateUserData(user);
        LocalStorage.instance.deleteData('another-profile-id');
        LocalStorage.instance.deleteData('author');
        LocalStorage.instance.deleteData('user');
        await Auth.instance.logOutAccount();
        // window.location.href = '#/account'; //<< Костыль
    };
}

export default SettingsModel;
