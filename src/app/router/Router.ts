import { onAuthStateChanged, User } from 'firebase/auth';
import Auth from '../../firebase/auth/Auth';
import UserState from '../../state/UserState';
import Base from '../base/Base';
import Observer from '../observer/Observer';
import findRoutes from '../routes/routes';
import EventType from '../types/EventType';

class Router {
    private $observer: Observer;

    private app: HTMLElement | null = null;
    private container: HTMLElement | null = null;

    public constructor(observer: Observer) {
        this.$observer = observer;
    }

    public init(): void {
        this.app = document.querySelector('#app');
        if (this.app == null) return;
        this.container = this.app.querySelector('.app-container');
        window.addEventListener('hashchange', this.onHascChange);
        this.onHascChange();
    }

    private getRoute(path: string): Base | null {
        let name = path.replace('#/', '');
        const nameSplit = name.split('/')[0];
        name = nameSplit;
        const result = findRoutes(name);
        return result === null ? null : result;
    }

    private tempRoute: Base | null = null;

    private onHascChange = async () => {
        console.log(window.location.hash);
        if (this.container === null) return;

        if (this.tempRoute !== null && this.tempRoute.unmount) this.tempRoute.unmount();
        const route = this.getRoute(window.location.hash);
        this.tempRoute = route;

        this.accessСheck();

        if (route === null) {
            ('NOT FOUND PAGE');
        } else {
            this.container.innerHTML = '';
            this.container.insertAdjacentHTML('afterbegin', route.render());
            route.mount();
        }
    };

    private accessСheck(): void {
        onAuthStateChanged(Auth.instance.Auth, (user: User | null) => {
            // << Проверка на Авторизаю Urer
            if (user === null) {
                window.location.hash = '#/account'; // << Проверка на Авторизаю User
                this.$observer.emit(EventType.DENIED, {});
            } else {
                const temp = window.location.hash;
                if (temp === '#/account' || temp === '' || temp === '#/') {
                    window.location.hash = '#/home';
                }
                this.$observer.emit(EventType.SUCCESS, {});
            } // << Проверка на Авторизаю User
            UserState.instance.CurrentUser = user;
        });
    }
}

export default Router;
