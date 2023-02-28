interface IPost {
    author: {
        fullname: string;
        nickName: string;
    };
    text: string;
    fileURL: string;
    userID: string;
    likesCount: number;
}

export default IPost;
