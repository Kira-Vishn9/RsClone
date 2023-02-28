import Observer from '../../../app/observer/Observer';
import UserService from '../../../firebase/service/UserSevice';
import EventType from '../types/EventType';

class SearchModel {
    private $observer: Observer;

    public constructor(observer: Observer) {
        this.$observer = observer;
    }

    public mount(): void {
        this.searchAllUser();
    }

    public unmount(): void {
        //
    }

    private async searchAllUser(): Promise<void> {
        const allUsers = await UserService.instance.getAllUser();
        if (allUsers !== null) {
            this.$observer.emit(EventType.GET_ALL_USER, allUsers);
        }
    }
}

export default SearchModel;
