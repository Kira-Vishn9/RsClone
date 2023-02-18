import { DataSnapshot } from "firebase/database";
import Observer from "../../../app/observer/Observer";
import IFollower from "../../../firebase/model/IFollower";
import IMessage from "../../../firebase/model/IMessage";
import ChatServise from "../../../firebase/service/ChatServis";
import FollowersService from '../../../firebase/service/FollowersService';
import UserState from "../../../state/UserState";
import Chat from "../chat/chat";
import EventType from "../type/EventType";

class MessageModel{
private obServer: Observer;

constructor(obServer: Observer){
    this.obServer = obServer;
}

private getFollows = async ({} ,callbackFollowers?: (folloers: IFollower[]) => void) => {
    const myUserId = UserState.instance.UserID;
        if (myUserId === null) return;
        const myFollowers = await FollowersService.instance.getFollowers(myUserId);
        if (myFollowers === null) return;
        if(callbackFollowers !== undefined){
        callbackFollowers(myFollowers)}
}
private startDialog = (data: any) => {
    this.userId = data.userID;
    this.recipienId = data.recipientId
    this.resipientName = data.recipientName;
    this.avatarsUrl = data.recipientAvatar;
};

private userId: string = '';
private recipienId: string = '';
private avatarsUrl: string = '';
private resipientName: string = '';

private getMessage = (message: string) => {
    let obj:IMessage = {
    UserId: this.userId,
    recipientId: this.recipienId,
    recipientAvatar: this.avatarsUrl,
    recipientName: this.resipientName,
    message: message,
    }
    ChatServise.instans.push(obj, ( data ) => {
        this.obServer.emit(EventType.messageback, data)
    });
}
 public init () {
    this.obServer.subscribe(EventType.recipientDialog, this.startDialog)
    this.obServer.subscribe(EventType.openModal, this.getFollows)
    this.obServer.subscribe(EventType.message, this.getMessage)
 }

}

export default MessageModel;