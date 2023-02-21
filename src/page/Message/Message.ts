import Base from '../../app/base/Base';
import Observer from '../../app/observer/Observer';
import MessageModel from './model/MessageModel';

import MessageView from './view/MessageView';

class Message extends Base {
    private obServer: Observer = new Observer();
    private view: MessageView = new MessageView(this.obServer);
    private messageModel: MessageModel = new MessageModel(this.obServer);

    public mount(): void {
        this.view.init();
        this.messageModel.init();
    }

    public unmount(): void {
        this.view.unmount();
        this.messageModel.unmount();
    }

    public render(): string {
        return this.view.make();
    }
}

export default Message;
