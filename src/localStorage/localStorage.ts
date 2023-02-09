import UserState from '../state/UserState';

export class LocalStorage {
    keyUser: string;
    public static instance = new LocalStorage();

    private constructor() {
        this.keyUser = 'user';
    }

    public getUser() {
        const userLocalStorage = localStorage.getItem(this.keyUser);
        if (userLocalStorage !== null) {
            return JSON.parse(userLocalStorage);
        }
        return {};
    }

    public putUser(id: string, email: string) {
        const userLocalStorage = this.getUser();
        userLocalStorage.id = id;
        userLocalStorage.email = email;
        UserState.instance.setUserID(id); //<< Doonn
        localStorage.setItem(this.keyUser, JSON.stringify(userLocalStorage));
        return { userLocalStorage };
    }

    public deleteUser() {
        localStorage.deleteItem(this.keyUser);
    }
}
