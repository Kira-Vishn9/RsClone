interface IMessage {
    UserId: string;
    recipientId: string;
    recipientAvatar: string;
    recipientName: string;
    message: string;
}

export default IMessage;
