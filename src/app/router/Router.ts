import Base from '../base/Base';
import findRoutes from '../routes/routes';

class Router {
    private app: HTMLElement | null = null;
    private container: HTMLElement | null = null;

    public init(): void {
        this.app = document.querySelector('#app');
        if (this.app == null) return;
        this.container = this.app.querySelector('.app-container');
        window.addEventListener('hashchange', this.onHascChange);
        this.onHascChange();
    }

    private getRoute(path: string): Base | null {
        const name = path.replace('#/', '');
        const result = findRoutes(name);
        return result === null ? null : result;
    }

    private tempRoute: Base | null = null;

    private onHascChange = () => {
        if (this.container === null) return;
        if (this.tempRoute !== null && this.tempRoute.unmount) this.tempRoute.unmount();
        const route = this.getRoute(window.location.hash);
        this.tempRoute = route;

        if (route === null) {
            console.log('NOT FOUND PAGE');
        } else {
            this.container.innerHTML = '';
            this.container.insertAdjacentHTML('afterbegin', route.render());
            route.mount();
        }
    };
}

export default Router;
