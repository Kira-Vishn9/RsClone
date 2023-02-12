import { DocumentReference, DocumentSnapshot } from 'firebase/firestore/lite';
import { LocalStorage } from '../localStorage/localStorage';
type obj = {
    fullname: string;
    nickName: string;
};

class UserState {
    public static instance = new UserState();
    private userID: string | null = null;
    private postsID: string[] = [];
    private author: obj = {
        fullname: '',
        nickName: '',
    };

    public get Author() {
        return this.author;
    }

    public set Author(author: obj) {
        this.author = author;
    }

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
