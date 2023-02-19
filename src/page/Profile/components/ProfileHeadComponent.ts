import '../ui/style/block.profile.scss';
import '../ui/style/data.profile.scss';

class ProfileHeadComponent {
    private parent: HTMLElement | null = null;
    private root: HTMLElement | null = null;
    private name: HTMLElement | null = null;
    private fullName: HTMLElement | null = null;

    private inputAvatar: HTMLInputElement | null = null;
    public get InputAvatar(): HTMLInputElement | null {
        return this.inputAvatar;
    }
    private imgAvatar: HTMLImageElement | null = null;

    private btnSettings: HTMLElement | null = null;
    public get BtnSettings() {
        return this.btnSettings;
    }

    public init(parent: HTMLElement) {
        this.parent = parent;
        this.root = this.parent.querySelector('.data__profile');
        if (this.root === null) return;
        this.name = this.root.querySelector('.name');
        this.fullName = this.root.querySelector('.full-name__profile');
        this.inputAvatar = this.root.querySelector('.input-avatar__profile');
        this.imgAvatar = this.root.querySelector('.img-avatar__profile');
        this.btnSettings = this.root.querySelector('.btn-settings__profile');
    }

    public make(): string {
        return `
        <div class="data__profile">
            <div class="avatar__profile" style="position: relative">
                <img class="img-avatar__profile" src="./assets/image/user.png">
                <input class="input-avatar__profile "type="file" style="position: absolute; top: 0; rigth: 0; botton: 0; left: 0; width: 100%; height: 100%; opacity: 0;">
            </div>

            <div class="root-block__profile">
                <div class="block__profile">
                    <span class="name">${this.name?.textContent}</span>
                    <button class="btn-settings__profile">Редактировать профиль</button>
                </div>
                ${this.makeDateProfileSocial(154, 155, 177)}
                <span class="full-name__profile">${this.fullName?.textContent}</span>
            </div>
        </div>
        `;
    }

    private makeDateProfileSocial(publication: number = 0, subscribers: number = 0, subscriptions: number = 0): string {
        return `
        <div class="social__profile">
            <div class="item-social publication__profile">
                <span>${publication}</span>
                <span>Публикации</span>
            </div>

            <div class="item-social subscribers__profile">
                <span>${subscribers}</span>
                <span>Подписчиков</span>
            </div>

            <div class="item-social subscriptions__profile">
                <span>${subscriptions}</span>
                <span>Подписок</span>
            </div>
        </div>
    `;
    }

    public changeAvatar(urlImg: string): void {
        if (this.imgAvatar === null) return;
        this.imgAvatar.src = urlImg;
    }

    public changeNickName(name: string): void {
        if (this.name === null) return;
        this.name.textContent = name;
    }

    public changeFullName(name: string): void {
        if (this.fullName === null) return;

        this.fullName.textContent = name;
    }

    public changeAmountPublications(amount: number): void {
        //
    }

    public changeAmountSubscribers(amount: number): void {
        //
    }

    public changeAmountSubscriptions(amount: number): void {
        //
    }
}

export default ProfileHeadComponent;
