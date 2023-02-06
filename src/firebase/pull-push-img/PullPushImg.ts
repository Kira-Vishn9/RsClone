import app from '../config/config';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { getApp } from 'firebase/app';

const testFileImg = 'src/shared/Assets/image/post-1.jpg';

// TODO
class PullPushImg {
    public static instance: PullPushImg = new PullPushImg();
    // private firebaseApp = getApp();
    private readonly storage = getStorage(app, 'gs://rs-clone-insta.appspot.com');
    private storageRef = ref(this.storage, 'Users/Images/');

    public async upload(): Promise<void> {
        const refImg = ref(this.storage, `Users/Images/${testFileImg}`);
        // const result = await uploadBytes(this.storageRef,refImg);
    }
}

export default PullPushImg;
