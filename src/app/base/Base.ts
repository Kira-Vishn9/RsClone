abstract class Base {
    public abstract mount(): void;

    public abstract unmount(): void;

    public abstract render(): string;
}

export default Base;
