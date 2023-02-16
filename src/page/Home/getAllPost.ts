import IPosts from '../../firebase/model/IPosts';
import Posts from '../../firebase/posts/posts';
import { LocalStorage } from '../../localStorage/localStorage';
import postView from './ui/postView';

async function getAllPosts() {
    const arrPosts = await Posts.init.getAllPosts();
    let postsHtml = '';
    arrPosts.sort((a, b) => b.time - a.time);
    arrPosts.forEach((item) => {
        const datePost = new Date(item.time);
        const timePost = datePost.toString().slice(3, 24);

        const likeBlack = addLikesInPost(item);
        let numberComment = 0;

        const commentsArr = item.comments;
        if (!commentsArr) return;
        numberComment = commentsArr.length;
        commentsArr.sort((a, b) => a.time - b.time);

        postsHtml += postView(
            item.author.nickName,
            item.fileURL,
            item.text,
            item.likesCount,
            timePost,
            item.postID,
            likeBlack,
            numberComment
        );
    });
    return postsHtml;
}

function addLikesInPost(item: IPosts) {
    const userId = LocalStorage.instance.getUser().id;

    if (item.likesUsers.indexOf(userId) !== -1) {
        return 'icons__like-black';
    } else {
        return '';
    }
}

export default getAllPosts;
