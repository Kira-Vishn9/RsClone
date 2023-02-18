import {
    getDatabase,
    set,
    ref,
    push,
    child,
    onValue,
    onChildAdded,
    DataSnapshot
  } from "firebase/database";
import app from "../config/config";
import IMessage from "../model/IMessage";

class ChatServise {

    public static instans: ChatServise = new ChatServise();
    private constructor () {};
    private database = getDatabase(app);
    private message = 'message';

    public push (arg: IMessage, callback: ( data: DataSnapshot ) => void) {
      const id = push(child(ref(this.database), this.message)).key;
      set(ref(this.database, `messages/${this.sortName('kira', arg.recipientName)}/` + id), {
          name: 'kira',
          message: arg.message,
      });

      const newMsg = ref(this.database, `messages/${this.sortName('kira', arg.recipientName)}/`);
      onChildAdded(newMsg, callback)
    }

    private sortName (name1: string, name2:string) {
      return [name1, name2].sort().join('');}
}

export default ChatServise;
