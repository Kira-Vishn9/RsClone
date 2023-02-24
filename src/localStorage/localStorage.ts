import UserState from '../state/UserState';

export class LocalStorage {
    keyUser: string;
    keyAuthor: string;
    public static instance = new LocalStorage();

    private constructor() {
        this.keyUser = 'user';
        this.keyAuthor = 'author';
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

        return { userLocalStorage };
    }

    public deleteUser() {
        localStorage.deleteItem(this.keyUser);
    }

    public getAuthor() {
        const userLocalStorage = localStorage.getItem(this.keyAuthor);
        if (userLocalStorage !== null) {
            return JSON.parse(userLocalStorage);
        }
        return {};
    }

    public putAuthor(name: string, nickName: string) {
        const userLocalStorage = this.getAuthor();
        userLocalStorage.name = name;
        userLocalStorage.nickName = nickName;
        localStorage.setItem(this.keyAuthor, JSON.stringify(userLocalStorage));
        return { userLocalStorage };
    }

    public setData(key: string, data: object | string): void {
        localStorage.setItem(key, JSON.stringify(data));
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public getData(key: string): any | null {
        const data = localStorage.getItem(key);
        if (data === null) return null;
        return JSON.parse(data);
    }
}
