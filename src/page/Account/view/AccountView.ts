import Auth from '../../../firebase/auth/Auth';
import IUser from '../../../firebase/model/IUser';
import UserService from '../../../firebase/service/UserSevice';
import { LocalStorage } from '../../../localStorage/localStorage';
import '../style/account.scss';
const logo = '../../../shared/Assets/svg/instagram-logo.svg';
enum StateBlockChangeAccount {
    LOGIN,
    REGISTRATION,
}

class AccountView {
    private root: HTMLElement | null = null;
    private textBlock: HTMLElement | null = null;
    private link: HTMLElement | null = null;
    private container: HTMLElement | null = null;
    private stateBlockChange = StateBlockChangeAccount.LOGIN;

    public init(): void {
        this.root = document.querySelector('.account');
        if (this.root === null) return;
        this.container = this.root.querySelector('.container__account');
        this.textBlock = this.root.querySelector('.text__block-change');
        this.link = this.root.querySelector('.link__block-change');

        this.link?.addEventListener('click', this.onLink);
        this.changeBlock();
    }

    public unmount(): void {
        this.link?.removeEventListener('click', this.onLink);
    }

    public make(): string {
        return `
        <section class="account">
            <div class="wrapper__account">
                <div class="container__account"></div>

                <div class="block-change__account">
                    <p class="text__block-change">У вас ещё нет аккаунта?</p>
                    <a class="link__block-change">Зарегистрироваться</a>
                <div>
            </div>
        </section>
        `;
    }

    private makeLogin(): string {
        return `
        <div class="login__account">
            <img class="logo__account" src="${logo}">

            <form class="form__account">
                <input class="input user-input__account" type="text" placeholder="эл. адрес">
                <input class="input password-input__account" type="text" placeholder="Пароль">
                <button class="btn__account" id="btn__login">Войти</button>
                <div id="divLoginError" class="input"></div>
            </form>
        </div>`;
    }

    private makeRegistration(): string {
        return `
        <div class="registration__account">
            <img class="logo__account" src="${logo}">
            <p class="text__registration">Зарегистрируйтесь, чтобы смотреть фото и видео ваших друзей.</p>

            <form class="form__account">
                <input class="input email-input__account" type="text" placeholder="эл. адрес">
                <input class="input name-surname-input__account" type="text" placeholder="Имя и Фамилия">
                <input class="input name-input__account" type="text" placeholder="Имя пользователя">
                <input class="input password-input__account" type="text" placeholder="Пароль">
                <button class="btn__account" id="btn__registr">Далее</button>
                <div id="divRegistrError" class="input"></div>
            </form>
        </div>`;
    }

    private userLogin() {
        if (this.root === null) return;
        const loginBtn = this.root.querySelector('#btn__login');
        loginBtn?.addEventListener('click', this.logHandler);
    }

    private logHandler = (e: Event) => {
        e.preventDefault();
        if (this.root === null) return;
        const loginBtn = this.root.querySelector('#btn__login');
        const divErr: HTMLFormElement | null = this.root.querySelector('#divLoginError');
        const email: HTMLInputElement | null = this.root.querySelector('.user-input__account');
        const password: HTMLInputElement | null = this.root.querySelector('.password-input__account');
        if (divErr) {
            if (email && password) {
                if (email.value && password.value) {
                    const logInfo = async (email: string, password: string) => {
                        const userInfo = await Auth.instance.signinUser(email, password);
                        if (userInfo) {
                            divErr.innerHTML = userInfo;
                        } else {
                            // переход в профиль
                            location.hash = '#/home';
                            loginBtn?.removeEventListener('click', this.logHandler);
                            const id = LocalStorage.instance.getUser().id;
                            this.infoAuthor(id);
                        }
                    };
                    logInfo(email.value, password.value);
                } else if (!email.value) {
                    divErr.innerHTML = 'Wrong email. Try again.';
                } else if (!password.value) {
                    divErr.innerHTML = 'Wrong password. Try again.';
                }

                this.deFocus(email, divErr);
                this.deFocus(password, divErr);
            }
        }
    };

    private async infoAuthor(id: string) {
        const data = await UserService.instance.getUser(id);
        if (data) {
            // LocalStorage.instance.putAuthor(data.name, data.nikName); // << Olga
            LocalStorage.instance.putAuthor(data.name, data.nickName); // << Olga
        }
    }

    private async userRegistration() {
        if (this.root === null) return;
        const regBtn = this.root.querySelector('#btn__registr');

        regBtn?.addEventListener('click', this.regHandler);
    }

    private regHandler = (e: Event) => {
        if (this.root === null) return;
        const regBtn = this.root.querySelector('#btn__registr');
        const divRegErr: HTMLElement | null = this.root.querySelector('#divRegistrError');
        const email: HTMLInputElement | null = this.root.querySelector('.email-input__account');
        const name: HTMLInputElement | null = this.root.querySelector('.name-surname-input__account');
        const nickName: HTMLInputElement | null = this.root.querySelector('.name-input__account');
        const password: HTMLInputElement | null = this.root.querySelector('.password-input__account');
        e.preventDefault();
        if (email && name && nickName && password && divRegErr) {
            if (email.value && name.value && nickName.value && password.value) {
                const user = {
                    email: email.value,
                    name: name.value,
                    nickName: nickName.value,
                    password: password.value,
                    avatar: '',
                };
                // LocalStorage.instance.putAuthor(name.value, nikName.value); // << Olga
                LocalStorage.instance.putAuthor(name.value, nickName.value); // << Olga
                const authInfo = async (user: IUser) => {
                    let errCode = await Auth.instance.signupUser(user);

                    if (errCode) {
                        if (errCode.includes('invalid-email')) {
                            divRegErr.innerHTML = 'Wrong email. Try again.';
                            errCode = '';
                        } else if (errCode.includes('email-already-in-use')) {
                            divRegErr.innerHTML = 'Email already in use. Try again.';
                            errCode = '';
                        } else if (errCode.includes('password')) {
                            divRegErr.innerHTML = 'Wrong password. Try again.';
                            errCode = '';
                        }
                    } else {
                        // переход  в профиль
                        location.hash = '#/home';
                        regBtn?.removeEventListener('click', this.regHandler);
                    }
                };

                authInfo(user);
            } else {
                divRegErr.innerHTML = 'Fill all fields.';
            }
            this.deFocus(email, divRegErr);
            this.deFocus(name, divRegErr);
            this.deFocus(nickName, divRegErr);
            this.deFocus(password, divRegErr);
        }
    };

    private deFocus(elem: HTMLElement, div: HTMLElement) {
        elem.onfocus = function () {
            div.innerHTML = '';
        };
    }

    private onLink = () => {
        this.changeBlock();
        this.userRegistration();
    };

    private changeBlock(): void {
        if (this.container === null) return;
        if (this.textBlock === null || this.link === null) return;
        switch (this.stateBlockChange) {
            case StateBlockChangeAccount.LOGIN:
                this.textBlock.textContent = 'У вас ещё нет аккаунта?';
                this.link.textContent = 'Зарегистрироваться';

                this.container.innerHTML = '';
                this.container.insertAdjacentHTML('afterbegin', this.makeLogin());
                this.userLogin();
                this.stateBlockChange = StateBlockChangeAccount.REGISTRATION;
                break;

            case StateBlockChangeAccount.REGISTRATION:
                this.textBlock.textContent = 'Есть аккаунт?';
                this.link.textContent = 'Вход';

                this.container.innerHTML = '';
                this.container.insertAdjacentHTML('afterbegin', this.makeRegistration());
                this.stateBlockChange = StateBlockChangeAccount.LOGIN;
                break;
        }
    }
}

export default AccountView;
