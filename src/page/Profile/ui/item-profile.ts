import './style/item.profile.scss';
function makePost(imgUrl: string, amountLike: number = 0, amountMessage: number = 0): string {
    return `
    <div class="item__profile">
        <img src="${imgUrl}">
        <div class="like-message__item">
            <div class="like__item">
                    <span></span>
                    <span>${amountLike}</span>
            </div>

            <div class="message__item">
                    <span></span>
                    <span>${amountMessage}</span>
            </div>
        </div>
    </div>
    `;
}
export default makePost;
