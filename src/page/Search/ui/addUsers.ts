import UserService from '../../../firebase/service/UserSevice';
import searchUser from './searchUser';

async function addUsersInBlock() {
    const allUsers = await UserService.instance.getAllUser();
    let searchHtml = '';
    if (allUsers !== null) {
        allUsers.forEach((item) => {
            searchHtml += searchUser(item.nikName, 'img', item.name);
        });
    }
    return searchHtml;
}

export default addUsersInBlock;
