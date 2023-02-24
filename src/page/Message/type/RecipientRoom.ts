import IChatRoom from '../../../firebase/model/IChatRoom';
import IUser from '../../../firebase/model/IUser';

type RecipientRoom = {
    room: IChatRoom;
    recipientUser: IUser;
};

export default RecipientRoom;
