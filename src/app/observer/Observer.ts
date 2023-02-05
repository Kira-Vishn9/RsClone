type Sub = {
    eventType: string;
    func: <T>(...args: T[]) => void;
};

class Observer {
    private subscribers: Sub[] = [];
    public subscribe<T>(eventType: string, fun: (...args: T[]) => void): void {
        //
    }

    public unsubscribe(): void {}

    public emit(): void {}
}

export default Observer;
