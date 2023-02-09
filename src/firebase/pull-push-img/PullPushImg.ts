import app from '../config/config';
import { getStorage, ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { FirebaseError, getApp } from 'firebase/app';
import userState from '../../state/user.state';

class PullPushImg {
    public static instance: PullPushImg = new PullPushImg();
    // private firebaseApp = getApp();
    private storage = getStorage(app, 'gs://rs-clone-insta.appspot.com/');
    private defaultPath = 'images';

    public async upload(file: File, fileName: string): Promise<void | string | FirebaseError> {
        try {
            const pathCreate = `${this.defaultPath}/${fileName}`;
            console.log(pathCreate);
            const refImg = ref(this.storage, pathCreate);
            // console.log(refImg);
            const result = await uploadBytes(refImg, await file.arrayBuffer());
            return this.getFile(fileName);
            // console.log('result: ' + result);
        } catch (error) {
            // console.log(error);
            console.log('Загрузка Файла Faild!!!');
        }
    }

    private async getFile(fileName: string): Promise<string | FirebaseError> {
        try {
            const refImg = ref(this.storage, `${this.defaultPath}/${fileName}`);
            const result = await getDownloadURL(refImg);
            return result;
        } catch (error) {
            const err = error as FirebaseError;
            console.log(err);
            return err;
        }
    }
}

export default PullPushImg;
