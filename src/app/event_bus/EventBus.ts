import Observer from '../observer/Observer';

class EventBus extends Observer {
    public readonly eventType = {
        LOAD_MESSAGE: 'eventLoadMessage',
        NOTIFICATION: 'eventNotification',
    };
    public static instance: EventBus = new EventBus();

    private constructor() {
        super();
    }
}

export default EventBus;
