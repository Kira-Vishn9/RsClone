enum EventType {
    INIT_OPEN_MODAL = 'eventInitOpenModal',
    CREATE_CHAT_ROOM = 'eventCreateChatRoom',
    GET_CHAT_ROOM = 'eventGetChatRoom',
    INIT_GET_ALL_CHAT__ROOM = 'eventInitGetAllChatRoom',
    // CREATE_CHAT_ROOM = 'eventCreateChatRoom',
    // INIT_CHAT_ROOM = 'eventInitChatRoom',
    // GET_ALL_CHAT_ROOM = 'eventGetAllChatRoom',
    START_DIALOG = 'eventStartDialog',
    // GET_ALL_MESSAGE_START_DIALOG = 'eventGetAllMessageStartDialog',
    SEND_MESSAGE = 'eventSendMessage',
    RECEIVE_MESSAGE = 'eventReceiveMessage',
    NOTIFICATION = 'eventNotification',
}

export default EventType;
