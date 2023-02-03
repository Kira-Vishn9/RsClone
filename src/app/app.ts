import footer from '../shared/components/footer/footer';
import Router from './router/Router';

class App {
    private router: Router = new Router();

    public init(): void {
        this.router.init();

        // панель навигации
        document.body.insertAdjacentHTML('beforeend', footer);
    }
}

export default App;
