import Home from '../../page/Home/Home';
import Registration from '../../page/Registration/Registration';
import Base from '../base/Base';
import PATHS from '../common/path';

const routes = [
    { path: PATHS.main, component: new Home() },
    { path: PATHS.registration, component: new Registration() },
];

function findRoutes(path: string): Base | null {
    for (let i = 0; i < routes.length; i += 1) {
        const route = routes[i];
        if (path === route.path) {
            if (route.component instanceof Base) {
                return route.component;
            }
        }
    }

    return null;
}

export default findRoutes;
