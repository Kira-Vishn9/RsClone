import app from '../config/config';
import { getStorage, ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { FirebaseError, getApp } from 'firebase/app';
import UserService from '../service/UserSevice';

class PullPushImg {
    public static instance: PullPushImg = new PullPushImg();
    private storage = getStorage(app, 'gs://rs-clone-insta.appspot.com/');
    private defaultPath = 'images';

    public async upload(file: File, fileName: string): Promise<void | string | FirebaseError> {
        try {
            const pathCreate = `${this.defaultPath}/${fileName}`;

            const refImg = ref(this.storage, pathCreate);
            //
            const result = await uploadBytes(refImg, await file.arrayBuffer());
            return this.getFile(fileName);
            //
        } catch (error) {
            //
        }
    }

    public async uploadAvatar(file: File): Promise<void | string> {
        try {
            const pathCreate = `avatars/${file.name}`;
            const refImg = ref(this.storage, pathCreate);
            const upload = await uploadBytes(refImg, await file.arrayBuffer());
            const result = await getDownloadURL(refImg);
            await UserService.instance.updateUserAvatar(result);
            return result;
        } catch (error) {
            //
        }
    }

    private async getFile(fileName: string): Promise<string | FirebaseError> {
        try {
            const refImg = ref(this.storage, `${this.defaultPath}/${fileName}`);
            const result = await getDownloadURL(refImg);
            return result;
        } catch (error) {
            const err = error as FirebaseError;

            return err;
        }
    }
}

export default PullPushImg;
