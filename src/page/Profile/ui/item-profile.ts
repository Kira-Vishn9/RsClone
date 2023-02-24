import './style/item.profile.scss';
function makePost(imgUrl: string, amountLike: number, amountMessage: number, idPost: string): string {
    return `
    <div class="item__profile" id="${idPost}">
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
