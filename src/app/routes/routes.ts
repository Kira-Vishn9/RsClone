import Home from '../../page/Home/Home';
import Message from '../../page/Message/Message';
import Profile from '../../page/Profile/Profile';
import Base from '../base/Base';
import PATHS from '../common/path';

const routes = [
    { path: PATHS.home, component: new Home() },
    { path: PATHS.message, component: new Message() },
    { path: PATHS.profile, component: new Profile() },
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
