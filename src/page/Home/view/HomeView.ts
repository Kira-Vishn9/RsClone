import Observer from '../../../app/observer/Observer';
import getAllPosts from '../getAllPost';
import storiesUser from '../ui/storiesUser';
import './mainHome.scss';

class HomeView {
    private postList: HTMLElement | null = null;

    public init() {
        this.postList = document.querySelector('.posts-list') as HTMLElement;
        this.addPostInDiv();
        //
    }

    private async addPostInDiv() {
        this.postList?.insertAdjacentHTML('beforeend', await getAllPosts());
        if (!this.postList) return;
        const blocks = this.postList.querySelectorAll('.post__text');
        blocks.forEach((item) => {
            this.textLength(item as HTMLElement);
        });
    }

    private textLength(block: HTMLElement) {
        const div = block.closest('div');
        if (!div) return;
        const moreText = div.querySelector('.more-text') as HTMLElement;
        const postComment = div.querySelector('.post__comment') as HTMLElement;
        if (!moreText) return;
        if (block.scrollHeight > block.clientHeight) {
            moreText.classList.add('visible-text');
            postComment.style.marginTop = `22px`;
            moreText.addEventListener('click', (e) => {
                this.showText(block, e);
            });
        }
    }

    private showText(block: HTMLElement, e: Event) {
        if (e.target instanceof HTMLElement) {
            e.target.classList.remove('visible-text');
            block.style.height = `${block.scrollHeight}px`;
        }
    }

    private addCommentsInPost() {}

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
