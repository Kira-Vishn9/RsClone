import './aside.scss';
import PopUpUploadComponent from './PopUpUploadView';

class AsideView {
    private root: HTMLElement | null = null;
    private upload: HTMLElement | null = null;
    private search: HTMLElement | null = null;

    public get Root() {
        return this.root;
    }

    public mount(): void {
        this.root = document.querySelector('.aside');
        if (this.root === null) return;
        this.upload = this.root.querySelector('.upload-btn');
        this.upload?.addEventListener('click', this.onUpload);
        // this.search = this.root.querySelector('.search-btn');
        // this.search?.addEventListener('click', this.searchQuery);
    }

    public unmount(): void {
        this.upload?.removeEventListener('click', this.onUpload);
    }

    public render(): string {
        return `
        <aside class="aside">
        <img src="./assets/image/logo.png" alt="instagram" class="logo">
        <ul class="aside__list">
          <li class="aside__list-item aside__list-active"><a href="#/home"><span class="home-ico"></span>Home</a></li>
          <li class="aside__list-item"><a href="#/message"><span class="messenger-ico"></span>Messages</a></li>
          <li class="aside__list-item upload-btn"><a ><span class="new-posts-ico"></span>Upload</a></li>
          <li class="aside__list-item"><a href="#/profile"><span class="profile-ico"></span>My profile</a></li>
          <li class="aside__list-item" search-btn><a href="#/search"><span class="search-ico"></span>Search</a></li>
        </ul>
      </aside>
        `;
    }

    private onUpload = () => {
        new PopUpUploadComponent().mount();
    };
}

export default AsideView;
