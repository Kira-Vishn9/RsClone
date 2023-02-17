import '../style/_input.settings.component.scss';

class InputSettingsComponent {
    private id: string = '';
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

        this.input = this.root.querySelector(`#${this.id}`);
    }

    public make(name: string, id: string): string {
        this.id = id;
        return `
        <div class="item__settings">
            <span class="name__item">${name}</span>
            <input id="${id}" class="input__item" type="text">
        </div>
        `.trim();
    }

    public changeInputValue(val: string): void {
        if (this.input === null) return;
        this.input.value = val;
    }

    public getValue(): string | null {
        if (this.input === null) return null;
        return this.input.value.trim();
    }
}

export default InputSettingsComponent;
