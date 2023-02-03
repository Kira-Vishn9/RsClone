import './style/data.profile.scss';

function dataProfile(publication: number, subscribers: number, subscriptions: number): string {
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

export default dataProfile;
