import Observer from '../observer/Observer';

class EventBus extends Observer {
    public readonly eventType = {
        LOAD_MESSAGE: 'eventLoadMessage',
    };
    public static instance: EventBus = new EventBus();

    private constructor() {
        super();
    }
}

export default EventBus;
