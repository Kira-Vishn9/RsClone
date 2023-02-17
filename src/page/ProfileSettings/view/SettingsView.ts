import Observer from '../../../app/observer/Observer';
import IUser from '../../../firebase/model/IUser';
import InputSettingsComponent from '../components/InputSettingsComponent';
import '../style/settings.scss';
import EventType from '../types/EventType';

class SettingsView {
    private $observer: Observer;
    private root: HTMLElement | null = null;

    private itemsOption: HTMLElement | null = null;

    private inputNameComponent: InputSettingsComponent = new InputSettingsComponent();
    private inputUserNameComponent: InputSettingsComponent = new InputSettingsComponent();
    private inputEmailComponent: InputSettingsComponent = new InputSettingsComponent();

    private submit: HTMLButtonElement | null = null;

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

        this.submit = this.root.querySelector('.submit__settings');

        this.itemsOption?.addEventListener('click', this.onOptions);
        this.submit?.addEventListener('click', this.onSubmit);

        this.$observer.subscribe(EventType.GET_USER, this.onUser);
    }

    public unmount(): void {
        this.itemsOption?.removeEventListener('click', this.onOptions);
        this.submit?.removeEventListener('click', this.onSubmit);
        this.$observer.unsubscribe(EventType.GET_USER, this.onUser);
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
                <div class="profile-edit__settings">
                    ${this.inputNameComponent.make('Имя', 'input-name-id')}
                    ${this.inputUserNameComponent.make('Имя Пользователя', 'input-user-name-id')}
                    ${this.inputEmailComponent.make('Эл. адрес', 'input-email-id')}
                </div>
                <button class="submit__settings">Отправить</button>
            </div>
        </div>
        `.trim();
    }

    private onOptions = () => {
        //
    };

    private tempUser: IUser | null = null;
    private onUser = (user: IUser) => {
        this.tempUser = user;
        this.inputNameComponent.changeInputValue(user.name);
        this.inputUserNameComponent.changeInputValue(user.nickName);
        this.inputEmailComponent.changeInputValue(user.email);
    };

    // TODO Refactoring
    private onSubmit = () => {
        if (this.tempUser === null) return;

        const getName = this.inputNameComponent.getValue(); // << Тупое решения надо будет добавить проход циклом
        if (getName !== null) {
            this.tempUser.name = this.tempUser?.name === getName ? this.tempUser.name : getName;
        }

        const getUserName = this.inputUserNameComponent.getValue(); // << Тупое решения надо будет добавить проход циклом
        if (getUserName !== null) {
            this.tempUser.nickName = this.tempUser.nickName === getUserName ? this.tempUser.nickName : getUserName;
        }

        const getEmail = this.inputEmailComponent.getValue(); // << Тупое решения надо будет добавить проход циклом
        if (getEmail !== null) {
            this.tempUser.email = this.tempUser.email === getEmail ? this.tempUser.email : getEmail;
        }

        const updateUser = {
            name: this.tempUser.name,
            nickName: this.tempUser.nickName,
            email: this.tempUser.email,
        };
        console.log('QQQQQQQQQQQQQQQQQQQQQQ');

        this.$observer.emit(EventType.UPDATE_USER, updateUser);
    };
}

export default SettingsView;
