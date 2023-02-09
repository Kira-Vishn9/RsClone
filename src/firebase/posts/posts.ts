import { getFirestore, collection, getDocs, doc, getDoc, setDoc, DocumentData } from 'firebase/firestore/lite';
import app from '../config/config';
import IPost from './model/IPost';

class Posts {
    public static init = new Posts();

    private db = getFirestore(app);
    private data = collection(this.db, 'Posts');

    public async getAllPosts(): Promise<IPost[]> {
        const collections = await getDocs(this.data);
        const data: IPost[] = collections.docs.map((doc) => doc.data()) as IPost[];
        return data;
    }
}
export default Posts;
