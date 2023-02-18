import Observer from "../../../app/observer/Observer";
import IFollower from "../../../firebase/model/IFollower";
import FollowersService from '../../../firebase/service/FollowersService';
import UserState from "../../../state/UserState";
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
    console.log(data.userID)
    console.log(data.recipientId)
};
 public init () {
    this.obServer.subscribe(EventType.recipientDialog, this.startDialog)
    this.obServer.subscribe(EventType.openModal, this.getFollows)
 }

}

export default MessageModel;