import getAllPosts from '../getAllPost';
import storiesUser from '../ui/storiesUser';
import './mainHome.scss';

class HomeView {
    private postList: HTMLElement | null = null;
    public init() {
        this.postList = document.querySelector('.posts-list') as HTMLElement;
        this.addPostInDiv();
    }

    async addPostInDiv() {
        this.postList?.insertAdjacentHTML('beforeend', await getAllPosts());
    }

    public unmount(): void {
        //
    }

    public make(): string {
        return `
        <div class="main">
          <div class="stories">
            <div class="stories__wrapper">
              ${storiesUser('dfsdfd')}
              ${storiesUser('dfsdfd')}
              ${storiesUser('dfsdfd')}
              ${storiesUser('dfsdfd')}
              ${storiesUser('dfsdfd')}
              ${storiesUser('dfsdfd')}
              ${storiesUser('dfsdfd')}
              ${storiesUser('dfsdfd')}
            </div>
            <div class="stories__next"></div>
          </div>

          <div class="posts-list"></div>
      </div>
      `.trim();
    }
}

export default HomeView;
