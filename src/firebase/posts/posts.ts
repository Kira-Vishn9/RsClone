import {
    getFirestore,
    collection,
    getDocs,
    doc,
    getDoc,
    setDoc,
    DocumentData,
    updateDoc,
} from 'firebase/firestore/lite';
import app from '../config/config';
import IPosts from '../model/IPosts';

class Posts {
    public static init = new Posts();

    private db = getFirestore(app);
    private data = collection(this.db, 'Posts');

    public async getAllPosts(): Promise<IPosts[]> {
        const collections = await getDocs(this.data);
        const data = collections.docs.map((doc) => doc.data()) as IPosts[];
        return data;
    }
}
export default Posts;
