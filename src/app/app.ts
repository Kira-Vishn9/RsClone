import Router from './router/Router';

class App {
    private router: Router = new Router();

    public init(): void {
        this.router.init();
    }
}

export default App;
