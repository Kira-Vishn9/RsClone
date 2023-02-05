import { getFirestore, collection, getDocs, doc, getDoc, getDocFromCache, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import app from '../config/config';
import IUser from '../model/IUser';

class Auth {
    public static instance = new Auth();

    private db = getFirestore(app);
    private data = collection(this.db, 'Users');

    // Вернуть массив юзеров
    public async getAllUser(): Promise<void> {
        const collections = await getDocs(this.data);
        const data = collections.docs.map((doc) => doc.data());
    }

    // Вернуть юзера или null
    public async getUser(email: string, password: string): Promise<IUser> {
        // const datasSet = collection(this.db, 'DatasSet');
        // const dataSnapshot = await getDocs(datasSet);
        // const dataSnapshot = await getDoc(datasSet.path);
        // const dataList = dataSnapshot.docs.map((doc) => doc.data());
        // console.log(dataList);
        // console.log(dataSnapshot)
        // const docRef = doc(this.data, 'xPEZiSFKJZpeMVHddnQS');
        // const docSnap = await getDoc(docRef);
        // docSnap.
        // const bb = docSnap.data();
        // const tt = await getDoc(bb);
        // console.log(docSnap.ref);
        const collections = await getDocs(this.data);

        const docData = collections.docs.map((doc) => doc.data());
        const getDoc = docData.filter((doc) => doc.email === email);
        const user = getDoc[0] as IUser;

        return user;
        // const bebe = getDoc.map((doc) => doc.data())
        // console.log(getDoc.map((doc) => console.log(doc)));
        // const docRef = doc(this.data, 'Tod');

        // const docSnap = await getDoc(docRef);
        // const snap = docSnap.data();
        // console.log(snap);
    }

    // записать юзера
    public async setUser(user: IUser): Promise<void> {
        const test = doc(this.data);
        await setDoc(test, user);
    }

    // Обновить данные юзера
    public async updateUser(): Promise<void> {
        //
    }
}

export default Auth;
