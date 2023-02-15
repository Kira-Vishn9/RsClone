import Base from '../../app/base/Base';
import PostsService from '../../firebase/service/PostsService';
import { LocalStorage } from '../../localStorage/localStorage';
import HomeView from './view/HomeView';

class Home extends Base {
    private view: HomeView = new HomeView();

    public mount(): void {
        console.log('HOME: MOUNT');
        this.view.init();
        const postList = document.querySelector('.posts-list');
        postList?.addEventListener('click', this.addLike);
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
