import Observer from '../../../app/observer/Observer';
import IUser from '../../../firebase/model/IUser';
import UserService from '../../../firebase/service/UserSevice';
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
        window.location.href = '#/account';
    };
}

export default SettingsModel;
