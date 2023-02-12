import Observer from '../../../app/observer/Observer';
import IUser from '../../../firebase/model/IUser';

class SettingsModel {
    private $observer: Observer;

    public constructor(observer: Observer) {
        this.$observer = observer;
    }

    public execute(): void {
        this.getUserData();
    }

    private getUserData(): void {
        //
    }

    private onChangeUserData = (user: IUser) => {
        //
    };
}

export default SettingsModel;
