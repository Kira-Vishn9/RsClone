import aside from '../page/aside/aside';
import main from '../page/mainHome/mainHome';
import messagePage from '../page/messagePage/messagePage';
import footer from './components/footer/footer';
import Router from './router/Router';

class App {
    private router: Router = new Router();

    public init(): void {
        this.router.init();

        // панель навигации
        const app = document.querySelector('#app');
        if (app) {
            app.insertAdjacentHTML('afterbegin', aside);
            /* app.insertAdjacentHTML('beforeend', main); */
            app.insertAdjacentHTML('beforeend', messagePage);
        }
        const container = document.querySelector('.container');
        if (container) {
            container.insertAdjacentHTML('beforeend', footer);
        }
    }
}

export default App;
