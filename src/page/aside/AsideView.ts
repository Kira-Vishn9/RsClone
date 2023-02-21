import UserService from '../../firebase/service/UserSevice';
import { LocalStorage } from '../../localStorage/localStorage';
import './aside.scss';
import PopUpUploadComponent from './PopUpUploadView';

class AsideView {
    private root: HTMLElement | null = null;
    private upload: HTMLElement | null = null;
    private search: HTMLElement | null = null;

    public mount(): void {
        this.root = document.querySelector('.aside');
        if (this.root === null) return;
        this.upload = this.root.querySelector('.upload-btn');
        this.upload?.addEventListener('click', this.onUpload);
        // this.search = this.root.querySelector('.search-btn');
        // this.search?.addEventListener('click', this.searchQuery);
    }

    public async render(): Promise<string> {
        const id = LocalStorage.instance.getUser().id;

        return `
            <aside class="aside">
                <img src="./assets/image/logo.png" alt="instagram" class="logo">
                <ul class="aside__list">
                    <li class="aside__list-item aside__list-active"><a href="#/home"><span class="home-ico"></span>Home</a></li>
                    <li class="aside__list-item"><a href="#/message"><span class="messenger-ico"></span>Messages</a></li>
                    <li class="aside__list-item upload-btn"><a ><span class="new-posts-ico"></span>Upload</a></li>
                    <li class="aside__list-item"><a href="#/profile"><img class="profile-ico" src="${await this.getAvatarUser(
                        id
                    )}">My profile</a></li>
                    <li class="aside__list-item" search-btn><a href="#/search"><span class="search-ico"></span>Search</a></li>
                </ul>
            </aside>
        `;
    }

    private onUpload = () => {
        new PopUpUploadComponent().mount();
    };

    private async getAvatarUser(id: string) {
        const user = await UserService.instance.getUser(id);
        if (user && user.avatar) {
            return user.avatar;
        } else {
            return '';
        }
    }
}

export default AsideView;
