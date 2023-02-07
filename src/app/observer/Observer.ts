type Sub = {
    eventType: string;
    func: <T>(...args: T[]) => void;
};

class Observer {
    private subscribers: Sub[] = [];
    public subscribe<T>(eventType: string, fun: <T>(...args: T[]) => void): void {
        const subject: Sub = {
            eventType: eventType,
            func: fun,
        };

        this.subscribers.push(subject);
    }

    public unsubscribe(eventType: string, fun: <T>(...args: T[]) => void): void {
        for (let i = 0; i < this.subscribers.length; i += 1) {
            const subscribe = this.subscribers[i];
            if (subscribe.eventType === eventType) {
                if (subscribe.func === fun) {
                    this.subscribers.splice(i, 1);
                    return;
                }
            }
        }
    }

    public emit<T>(eventType: string, ...args: T[]): void {
        for (let i = 0; i < this.subscribers.length; i += 1) {
            const subscribe = this.subscribers[i];
            if (subscribe.eventType === eventType) {
                subscribe.func(args);
            }
        }
    }
}

export default Observer;
