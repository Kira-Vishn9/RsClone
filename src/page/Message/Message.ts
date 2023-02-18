import Base from '../../app/base/Base';
import Observer from '../../app/observer/Observer';
import MessageModel from './model/MessageModel';

import MessageView from './view/MessageView';

class Message extends Base {
    private obServer: Observer = new Observer();
    private view: MessageView = new MessageView(this.obServer);
    private messageModel: MessageModel = new MessageModel(this.obServer); 

    public mount(): void {
        console.log('MESSAGE: MOUNT');
        this.messageModel.init();
        this.view.init();
    }

    public unmount(): void {
        console.log('MESSAGE: UNMOUNT');
        this.view.unmount();
    }

    public render(): string {
        return this.view.make();
    }
}

export default Message;
