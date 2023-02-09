import aside from '../page/aside/aside';
import createPopap from '../page/aside/popapUpload';
import footer from '../shared/components/footer/footer';
import Router from './router/Router';


class App {
    private router: Router = new Router();

    public async init() {
        this.router.init();

        // панель навигации
        const app = document.querySelector('#app');
        if (app) {
            app.insertAdjacentHTML('afterbegin', aside);
        }
        const upload = document.querySelector('.upload-btn') as HTMLElement;
        
        upload.addEventListener('click', createPopap);
        const container = document.querySelector('.container');
        if (container) {
            container.insertAdjacentHTML('beforeend', footer);
        }
    }
}

export default App;
