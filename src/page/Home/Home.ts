import Base from '../../app/base/Base';
import PostsService from '../../firebase/service/PostsService';
import UserService from '../../firebase/service/UserSevice';
import { LocalStorage } from '../../localStorage/localStorage';
import OpenImg from '../../profileOpenImg/OpenImg';
import PopupPost from './popupPost';
import HomeView from './view/HomeView';

class Home extends Base {
    private view: HomeView = new HomeView();

    public mount(): void {
        console.log('HOME: MOUNT');
        this.view.init();
        const postList = document.querySelector('.posts-list');
        postList?.addEventListener('click', this.addLike);
        postList?.addEventListener('click', this.openPost);
        postList?.addEventListener('click', this.addComment);
    }

    private async addComment(e: Event) {
        if (!e.target) return;
        if (e.target instanceof HTMLElement) {
            const nickName: string = LocalStorage.instance.getAuthor().nickName;
            const userId: string = LocalStorage.instance.getUser().id;
            const postBlock = e.target.closest('.newsline') as HTMLElement;
            const idPost = postBlock.id;
            const commentDiv = postBlock.querySelector('.comments-all') as HTMLDivElement;
            const countCommentBlock = postBlock.querySelector('.count-comment') as HTMLElement;
            const countComment = countCommentBlock.textContent;
            const post = await PostsService.instance.getPost(idPost);
            const user = await UserService.instance.getUser(userId);
            if (!user) return;
            const postComment = post?.comments;
            if (e.target.classList.contains('comment__btn')) {
                const commentBlock = e.target.previousElementSibling as HTMLTextAreaElement;
                let comment = commentBlock.value;

                if (comment && countComment && postBlock) {
                    countCommentBlock.textContent = `${+countComment + 1}`;
                    const commentObj = {
                        nickName: nickName,
                        text: comment,
                        time: Date.now(),
                        avatar: user.avatar,
                    };
                    postComment?.push(commentObj);
                    await PostsService.instance.updatePosts(idPost, { comments: postComment });
                    commentBlock.value = '';

                    const html = `
                        <div class="comments-item">
                            <span>${nickName}</span>
                            <p>${comment}</p>
                        </div>
                    `;

                    commentDiv.insertAdjacentHTML('beforeend', html);
                }
            }
        }
    }

    private openPost(e: Event) {
        if (!e.target) return;
        if (e.target instanceof HTMLElement) {
            if (e.target.classList.contains('icons__comment') || e.target.classList.contains('post__comment')) {
                const postBlock = e.target.closest('.newsline') as HTMLElement;
                const idPost = postBlock.id;
                const popupPost = new PopupPost();
                popupPost.mount(idPost);
                document.body.classList.add('covert');
            }
        }
    }

    private async addLike(e: Event) {
        if (!e.target) return;
        if (e.target instanceof HTMLElement) {
            const idUser: string = LocalStorage.instance.getUser().id;
            const postBlock = e.target.closest('.newsline') as HTMLElement;
            const idPost = postBlock.id;
            const countBlock = postBlock.querySelector('.count-likes') as HTMLElement;
            const count = countBlock.textContent;
            const post = await PostsService.instance.getPost(idPost);
            if (!post) return;
            const postUsersLike = post.likesUsers;
            const index = postUsersLike.indexOf(idUser);

            if (e.target.classList.contains('icons__like')) {
                e.target.classList.toggle('icons__like-black');
                let countLikes = 0;
                if (e.target.classList.contains('icons__like-black')) {
                    if (count) {
                        countLikes = +count + 1;
                        countBlock.textContent = `${countLikes}`;
                        if (index === -1) {
                            postUsersLike.push(idUser);
                        }
                    }
                } else {
                    if (count) {
                        countLikes = +count - 1;
                        countBlock.textContent = `${countLikes}`;
                        if (index !== -1) {
                            postUsersLike.splice(index, 1);
                        }
                    }
                }
                const objUpdate = {
                    likesCount: countLikes,
                    likesUsers: postUsersLike,
                };
                PostsService.instance.updatePosts(idPost, objUpdate);
            }
        }
    }

    public unmount(): void {
        console.log('HOME: UNMOUNT');
        this.view.unmount();
    }

    public render(): string {
        return this.view.make();
    }
}

export default Home;
