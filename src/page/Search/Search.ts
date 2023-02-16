import Base from '../../app/base/Base';
import Observer from '../../app/observer/Observer';
import SearchModel from './model/SearchModel';
import SearchView from './view/SearchView';

class Search extends Base {
    private $observer: Observer = new Observer();
    private view: SearchView = new SearchView(this.$observer);
    private model: SearchModel = new SearchModel(this.$observer);

    public mount(): void {
        console.log('Search: MOUNT');
        this.model.mount();
        this.view.init();
    }

    public unmount(): void {
        console.log('Search: UNMOUNT');
        this.model.unmount();
        this.view.unmount();
    }

    public render(): string {
        return this.view.make();
    }
}

export default Search;
