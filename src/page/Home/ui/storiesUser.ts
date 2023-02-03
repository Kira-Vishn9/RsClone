import '../view/mainHome.scss';

function storiesUser(name: string): string {
    return `
        <div class="user">
            <div class="user__avatar"></div>
            <div class="user__name">${name}</div>
        </div>
    `;
}

export default storiesUser;
