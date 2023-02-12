import Observer from '../../../app/observer/Observer';
import InputSettingsComponent from '../components/InputSettingsComponent';
import '../style/settings.scss';

class SettingsView {
    private $observer: Observer;
    private root: HTMLElement | null = null;

    private itemsOption: HTMLElement | null = null;

    private inputNameComponent: InputSettingsComponent = new InputSettingsComponent();
    private inputUserNameComponent: InputSettingsComponent = new InputSettingsComponent();
    private inputEmailComponent: InputSettingsComponent = new InputSettingsComponent();

    public constructor(observer: Observer) {
        this.$observer = observer;
    }

    public init(): void {
        this.root = document.querySelector('.settings');
        if (this.root === null) return;
        this.itemsOption = this.root.querySelector('.options__settings');

        this.inputNameComponent.init(this.root);
        this.inputUserNameComponent.init(this.root);
        this.inputEmailComponent.init(this.root);

        this.itemsOption?.addEventListener('click', this.onOptions);
    }

    public unmount(): void {
        this.itemsOption?.removeEventListener('click', this.onOptions);
    }

    public make(): string {
        return `
        <div class="settings">
            <ul class="options__settings">
                <li class="item__options">Редактировать профиль</li>
                <li class="item__options">Сменить пароль</li>
                <li class="item__options">Приложения и сайты</li>
                <li class="item__options">Уведомления по электронной почте</li>
                <li class="item__options">Push-уведомления</li>
                <li class="item__options">Управление контактами</li>
                <li class="item__options">Конфиденциальность и безопасность</li>
                <li class="item__options">Реклама</li>
                <li class="item__options">Контроль</li>
                <li class="item__options">Входы в аккаунт</li>
                <li class="item__options">Электронные письма от Insta-Clone-Костыль</li>
                <li class="item__options">Помощь(Noup)</li>
            </ul>
            <div class="content__settings">
                ${this.inputNameComponent.make('Имя')}
                ${this.inputUserNameComponent.make('Имя Пользователя')}
                ${this.inputEmailComponent.make('Эл. адрес')}
                <button class="submit__settings">Отправить</button>
            </div>
        </div>
        `.trim();
    }

    private onOptions = () => {
        //
    };
}

export default SettingsView;
