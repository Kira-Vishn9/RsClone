class UserState {
    public static instance = new UserState();
    private userID: string | null = null;
    private postsID: string[] = [];

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
