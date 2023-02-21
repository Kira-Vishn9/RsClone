import AsideView from '../page/aside/AsideView';
import footer from '../shared/components/footer/footer';
import Router from './router/Router';

class App {
    private router: Router = new Router();

    public async init() {
        this.router.init();

        // панель навигации
        const app = document.querySelector('#app');
        if (app) {
            const aside = new AsideView();
            app.insertAdjacentHTML('afterbegin', await aside.render());
            aside.mount();
        }

        const container = document.querySelector('.container');
        if (container) {
            container.insertAdjacentHTML('beforeend', footer);
        }
    }
}

export default App;
