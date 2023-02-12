class InputSettingsComponent {
    private parent: HTMLElement | null = null;
    private root: HTMLElement | null = null;

    private input: HTMLInputElement | null = null;
    public get Input() {
        return this.input;
    }

    public init(parent: HTMLElement): void {
        this.parent = parent;
        this.root = this.parent.querySelector('.profile-edit__settings');
        if (this.root === null) return;

        this.input = this.root.querySelector('.input__item');
    }

    public make(name: string): string {
        return `
        <div class="profile-edit__settings">
            <div class="item__settings">
                <span class="name__item">${name}</span>
                <input class="input__item" type="text">
            </div>
        </div>
        `.trim();
    }

    public changeInputValue(val: string): void {
        if (this.input === null) return;
        this.input.value = val;
    }
}

export default InputSettingsComponent;
