import Base from '../../app/base/Base';

class Message extends Base {
    public mount(): void {
        console.log('MESSAGE: MOUNT');
    }

    public unmount(): void {
        console.log('MESSAGE: UNMOUNT');
    }

    public render(): string {
        return `MESSAGE`.trim();
    }
}

export default Message;
