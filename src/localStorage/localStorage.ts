import UserState from '../state/UserState';

export class LocalStorage {
    private keyUser: string;
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
        localStorage.setItem(this.keyUser, JSON.stringify(userLocalStorage));

        // UserState.instance.setUserID(id); //<< Doonn

        return { userLocalStorage };
    }

    public deleteUser() {
        localStorage.deleteItem(this.keyUser);
    }
}
