import ISubscription from '../../../firebase/model/ISubscription';
import IUser from '../../../firebase/model/IUser';

type SubscribedType = {
    user: IUser;
    subscribed: ISubscription | null;
};

export default SubscribedType;
