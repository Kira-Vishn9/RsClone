import IFollower from '../../../firebase/model/IFollower';
import ISubscription from '../../../firebase/model/ISubscription';

type SubFolType = {
    subs: ISubscription[];
    follows: IFollower[];
};

export default SubFolType;
