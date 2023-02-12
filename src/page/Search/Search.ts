import Base from '../../app/base/Base';
import SearchView from './view/SearchView';

class Search extends Base {
    private view: SearchView = new SearchView();

    public mount(): void {
        console.log('Search: MOUNT');
        this.view.init();
    }

    public unmount(): void {
        console.log('Search: UNMOUNT');
        this.view.unmount();
    }

    public render(): string {
        return this.view.make();
    }
}

export default Search;
