import Base from '../../app/base/Base';
import MessageView from './view/MessageView';
class Message extends Base {
    private view: MessageView = new MessageView();

    public mount(): void {
        console.log('MESSAGE: MOUNT');
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
