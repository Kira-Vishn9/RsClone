import { getFirestore, collection, getDocs, doc, getDoc, setDoc, DocumentData } from 'firebase/firestore/lite';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import app from '../config/config';
import IPosts from '../model/IPosts';

class PostsService {
    public static instance: PostsService = new PostsService();

    private constructor() {
        //
    }

    private db = getFirestore(app);
    private data = collection(this.db, 'Posts');

    // Вернуть массив юзеров
    public async getAllPosts(): Promise<IPosts[] | boolean> {
        try {
            const collections = await getDocs(this.data);
            const data: IPosts[] = collections.docs.map((doc) => doc.data()) as IPosts[];
            return data;
        } catch (error: unknown) {
            console.error(error);
            return false;
        }
    }

    public async getPost(id: string): Promise<IPosts | boolean> {
        try {
            const data = doc(this.data, id);
            const dataSnap = await getDoc(data);
            const result = dataSnap.data() as IPosts;
            return result;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    public async setPosts(post: IPosts): Promise<void> {
        try {
            const test = doc(this.data);
            await setDoc(test, post);
        } catch (error) {
            console.log(error);
        }
    }
}

export default PostsService;
