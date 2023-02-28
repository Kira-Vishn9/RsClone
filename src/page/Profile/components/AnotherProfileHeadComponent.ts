import '../ui/style/block.profile.scss';
import '../ui/style/data.profile.scss';

class AnotherProfileHeadComponent {
    private parent: HTMLElement | null = null;
    private root: HTMLElement | null = null;
    private name: HTMLElement | null = null;
    private fullName: HTMLElement | null = null;

    private imgAvatar: HTMLImageElement | null = null;
    public get ImgAvatar() {
        return this.imgAvatar?.src;
    }

    private btnSubUnSub: HTMLButtonElement | null = null;
    public get BtnSubUnSub() {
        return this.btnSubUnSub;
    }

    public get Fullname() {
        return this.fullName?.textContent;
    }

    private attributeUserID: string | null = null;
    public get UserID() {
        return this.attributeUserID;
    }

    public get Name() {
        return this.name?.textContent;
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
        this.imgAvatar = this.root.querySelector('.img-avatar__profile');
        this.btnSubUnSub = this.root.querySelector('.sub-unsub__profile');

        const publications: HTMLElement | null = this.root.querySelector('.publication__profile');
        const subsribtions: HTMLElement | null = this.root.querySelector('.subscriptions__profile');
        const followers: HTMLElement | null = this.root.querySelector('.followers__profile');

        if (publications === null || subsribtions === null || followers === null) return;
        this.publications = publications?.querySelector('span');
        this.subsribtions = subsribtions?.querySelector('span');
        this.followers = followers.querySelector('span');
    }

    // eslint-disable-next-line prettier/prettier
    public make(
        avatars: string | null,
        userFullname: string | null,
        userNickName: string | null,
        btnTextSubUnSub: string,
        userID: string
    ): string {
        this.attributeUserID = userID;
        return `
        <div class="data__profile" user-id="${userID}">
            <div class="avatar__profile" style="position: relative">
                <img class="img-avatar__profile" src="${avatars}">
            </div>
            
            <div class="root-block__profile">
                <div class="block__profile">
                    <span class="name">${userNickName}</span>
                    <button class="sub-unsub__profile">${btnTextSubUnSub}</button>
                </div>
                ${this.makeDateProfileSocial()}
                <span class="full-name__profile">${userFullname}</span>
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

    public btnUnSubscribed(): void {
        if (this.btnSubUnSub === null) return;
        this.btnSubUnSub.textContent = 'Отписаться';
    }

    public btnSubscribed(): void {
        if (this.btnSubUnSub === null) return;
        this.btnSubUnSub.textContent = 'Подписаться';
    }

    public checkBtnState(): boolean | null {
        if (this.btnSubUnSub === null) return null;
        const text = this.btnSubUnSub.textContent;
        if (text === null) return null;
        if (text === 'Подписаться') {
            return false;
        } else {
            return true;
        }
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

export default AnotherProfileHeadComponent;
