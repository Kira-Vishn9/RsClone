import Posts from '../../firebase/posts/posts';
import postView from './ui/postView';

async function getAllPosts() {
    const arrPosts = await Posts.init.getAllPosts();
    let postsHtml = '';
    arrPosts.forEach((item) => {
        postsHtml += postView(item.caption, item.fileName);
    });
    return postsHtml;
}
export default getAllPosts;
