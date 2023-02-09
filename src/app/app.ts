import aside from '../page/aside/aside';
import AsideView from '../page/aside/AsideView';
import createPopap from '../page/aside/popapUpload';
import PopUpUploadComponent from '../page/aside/PopUpUploadView';
import footer from '../shared/components/footer/footer';
import Router from './router/Router';

class App {
    private router: Router = new Router();

    public init(): void {
        this.router.init();

        // панель навигации
        const app = document.querySelector('#app');
        if (app) {
            // app.insertAdjacentHTML('afterbegin', aside);
            const aside = new AsideView();
            app.insertAdjacentHTML('afterbegin', aside.render());
            aside.mount();
        }
        // const upload = document.querySelector('.upload-btn') as HTMLElement;
        // upload.addEventListener('click', createPopap);

        const container = document.querySelector('.container');
        if (container) {
            container.insertAdjacentHTML('beforeend', footer);
        }
    }
}

export default App;
