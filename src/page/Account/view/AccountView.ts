import Auth from '../../../firebase/auth/Auth';
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
            </form>
        </div>`;
    }

    // private userLogin() {
    //     const loginBtn = document.querySelector('#btn__login');
    //     const divErr: HTMLFormElement | null = document.querySelector('#divLoginError');
    //     const email: HTMLInputElement | null = document.querySelector('.user-input__account');
    //     const password: HTMLInputElement | null = document.querySelector('.password-input__account');
    //     loginBtn?.addEventListener('click', (e) => {
    //         e.preventDefault();
    //         if (divErr) {
    //             if (email && password) {
    //                 if (email.value && password.value) {
    //                     Auth.instance.logIn(email.value, password.value);
    //                     Auth.instance.monitorAuthState();
    //                 } else if (!email.value) {
    //                     divErr.innerHTML = 'Wrong email. Try again.';
    //                 } else if (!password.value) {
    //                     divErr.innerHTML = 'Wrong password. Try again.';
    //                 }
    //             }
    //         }
    //     });
    //     if (email && divErr) {
    //         email.onfocus = function () {
    //             divErr.innerHTML = '';
    //         };
    //     }
    // }

    // private userRegistration() {
    //     const regBtn = document.querySelector('#btn__registr');
    //     const email: HTMLInputElement | null = document.querySelector('.email-input__account');
    //     const name: HTMLInputElement | null = document.querySelector('.name-surname-input__account');
    //     const nikName: HTMLInputElement | null = document.querySelector('.name-input__account');
    //     const password: HTMLInputElement | null = document.querySelector('.password-input__account');
    //     regBtn?.addEventListener('click', (e) => {
    //         e.preventDefault();
    //         if (email && name && nikName && password) {
    //             const user = {
    //                 email: email.value,
    //                 name: name.value,
    //                 nikName: nikName.value,
    //                 password: password.value,
    //             };
    //             console.log(user);
    //             Auth.instance.setUser(user);
    //             Auth.instance.authentication(email.value, password.value);
    //             email.value = '';
    //             name.value = '';
    //             nikName.value = '';
    //             password.value = '';
    //         }
    //     });
    // }

    private onLink = () => {
        this.changeBlock();
        // this.userRegistration();
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
                // this.userLogin();
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
