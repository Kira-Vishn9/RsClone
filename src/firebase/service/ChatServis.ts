import {
    getDatabase,
    set,
    ref,
    push,
    child,
    onValue,
    onChildAdded
  } from "firebase/database";
import app from "../config/config";
import IMessage from "../model/IMessage";

class ChatServise {

    public static instans: ChatServise = new ChatServise();
    private constructor () {};
    private database = getDatabase(app);
    private message = 'message';

    public push (arg: IMessage) {

    }

}

export default ChatServise;
