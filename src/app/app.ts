import Auth from '../firebase/auth/Auth';
import { LocalStorage } from '../localStorage/localStorage';
import AsideView from '../page/aside/AsideView';
import footer from '../shared/components/footer/footer';
import Observer from './observer/Observer';
import Router from './router/Router';
import EventType from './types/EventType';

class App {
    private $observer: Observer = new Observer();
    private router: Router = new Router(this.$observer);
    private app: HTMLElement | null = document.querySelector('#app');
    private aside: AsideView = new AsideView();

    public init() {
        this.router.init();
        // панель навигации

        const container = document.querySelector('.container');
        if (container) {
            container.insertAdjacentHTML('beforeend', footer);
        }

        this.$observer.subscribe(EventType.DENIED, this.onDenied);
        this.$observer.subscribe(EventType.SUCCESS, this.onSuccess);
    }

    private onDenied = () => {
        ('ASIDE');
        this.aside.unmount();
        this.aside.Root?.remove();
    };

    private onSuccess = async () => {
        if (this.app) {
            this.aside.Root?.remove();
            this.app.insertAdjacentHTML('afterbegin', await this.aside.render());
            this.aside.mount();
        }
    };
}

export default App;
