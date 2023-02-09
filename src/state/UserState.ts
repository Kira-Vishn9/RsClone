import { LocalStorage } from '../localStorage/localStorage';

class UserState {
    public static instance = new UserState();
    private userID: string | null = null;
    private postsID: string[] = [];

    private constructor() {
        const user = LocalStorage.instance.getUser();
        if (user.id !== '' || user.id !== null || user.id !== undefined) {
            this.userID = user.id;
        }
    }

    public get UserID() {
        return this.userID;
    }

    public get PostsID() {
        return this.postsID;
    }

    public addPostID(id: string): void {
        this.postsID.push(id);
    }

    public setUserID(id: string): void {
        this.userID = id;
    }
}

export default UserState;
