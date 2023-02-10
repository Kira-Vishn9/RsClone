import '../style/search.scss';
import addUsersInBlock from '../ui/addUsers';
import searchUser from '../ui/searchUser';

class SearchView {
    private searchList: HTMLElement | null = null;
    public init(): void {
        this.searchList = document.querySelector('.search__main');
        this.addSearchUsers();
    }

    async addSearchUsers() {
        this.searchList?.insertAdjacentHTML('beforeend', await addUsersInBlock());
    }

    public unmount(): void {
        //
    }

    public make(): string {
        return `
            <div class="search">
                <div class="search__header">
                    <input class="search__header-input" type="search" placeholder="Search">
                </div>
                <div class="search__main">
                </div>
            </div>
    `.trim();
    }
}

export default SearchView;
