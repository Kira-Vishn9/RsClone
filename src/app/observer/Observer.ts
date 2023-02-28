type Sub = {
    eventType: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    func: (args: any, cb?: (args: any) => void) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
};

class Observer {
    private subscribers: Sub[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public subscribe<T>(eventType: string, fun: (args: any) => void): void {
        const subject: Sub = {
            eventType: eventType,
            func: fun,
        };

        this.subscribers.push(subject);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public unsubscribe<T>(eventType: string, fun: (args: any) => void): void {
        for (let i = 0; i < this.subscribers.length; i += 1) {
            const subscribe = this.subscribers[i];
            if (subscribe.eventType === eventType) {
                if (subscribe.func === fun) {
                    this.subscribers.splice(i, 1);
                    console.log('suvVV::', subscribe);
                    return;
                }
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public emit<T>(eventType: string, args: any, callback?: (args: any) => void): void | string {
        for (let i = 0; i < this.subscribers.length; i += 1) {
            const subscribe = this.subscribers[i];
            if (subscribe.eventType === eventType) {
                // const result: T = Object.assign([...args]);
                if (callback !== undefined) {
                    subscribe.func(args, callback);
                } else {
                    subscribe.func(args);
                }
            }
        }
    }
}

export default Observer;
