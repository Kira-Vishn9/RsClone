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

    private btnSubscriptions: HTMLElement | null = null;
    public get BtnSubscriptions() {
        return this.btnSubscriptions;
    }

    private btnFollowers: HTMLElement | null = null;
    public get BtnFollowers() {
        return this.btnFollowers;
    }

    // posts followers subscribtions
    private publications: HTMLElement | null = null;
    private subsribtions: HTMLElement | null = null;
    private followers: HTMLElement | null = null;

    public init(parent: HTMLElement) {
        this.parent = parent;
        this.root = this.parent.querySelector('.data__profile');
        if (this.root === null) return;
        this.name = this.root.querySelector('.name');
        this.fullName = this.root.querySelector('.full-name__profile');
        this.inputAvatar = this.root.querySelector('.input-avatar__profile');
        this.imgAvatar = this.root.querySelector('.img-avatar__profile');
        this.btnSettings = this.root.querySelector('.btn-settings__profile');

        this.btnSubscriptions = this.root.querySelector('.subscriptions__profile');
        this.btnFollowers = this.root.querySelector('.followers__profile');

        const publications: HTMLElement | null = this.root.querySelector('.publication__profile');
        const subsribtions: HTMLElement | null = this.root.querySelector('.subscriptions__profile');
        const followers: HTMLElement | null = this.root.querySelector('.followers__profile');

        if (publications === null || subsribtions === null || followers === null) return;
        this.publications = publications?.querySelector('span');
        this.subsribtions = subsribtions?.querySelector('span');
        this.followers = followers.querySelector('span');
    }

    public make(): string {
        return `
        <div class="data__profile">
            <div class="avatar__profile" style="position: relative">
                <img class="img-avatar__profile" src="https://kipmu.ru/wp-content/uploads/jptr-1.jpg">
                <input class="input-avatar__profile "type="file" style="position: absolute; top: 0; rigth: 0; botton: 0; left: 0; width: 100%; height: 100%; opacity: 0;">
            </div>
            
            <div class="root-block__profile">
                <div class="block__profile">
                    <span class="name">${this.name?.textContent}</span>
                    <button class="btn-settings__profile">Редактировать профиль</button>
                </div>
                ${this.makeDateProfileSocial()}
                <span class="full-name__profile">${this.fullName?.textContent}</span>
            </div>
        </div>
        `;
    }

    private makeDateProfileSocial(): string {
        return `
        <div class="social__profile">
            <div class="item-social publication__profile">
                <span>${this.publications?.textContent === undefined ? 0 : this.publications?.textContent}</span>
                <span>Публикации</span>
            </div>

            <div class="item-social followers__profile">
                <span>${this.followers?.textContent === undefined ? 0 : this.followers?.textContent}</span>
                <span>Подписчиков</span>
            </div>
        
            <div class="item-social subscriptions__profile">
                <span>${this.subsribtions?.textContent === undefined ? 0 : this.subsribtions?.textContent}</span>
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
        if (this.publications === null) return;
        this.publications.textContent = `${amount}`;
    }

    public changeAmountFollowers(amount: number): void {
        if (this.followers === null) return;
        this.followers.textContent = `${amount}`;
    }

    public changeAmountSubscriptions(amount: number): void {
        if (this.subsribtions === null) return;
        this.subsribtions.textContent = `${amount}`;
    }
}

export default ProfileHeadComponent;
