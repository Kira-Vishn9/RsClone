import '../view/mainHome.scss';

function postView(
    nickName: string,
    img: string,
    text: string,
    likes: number,
    time: string,
    postID: string,
    likeBlack: string,
    numberComment: number,
    avatar: string
): string {
    let postText = '';
    if (text) {
        postText = `
          <span class="post__nickname">${nickName}</span>${text}
        `;
    }

    return `
      <div class="newsline" id="${postID}">
        <div class="newsline__header">
          <div class="user__avatar small-avatar">
            <img class="img-avatar" src="${avatar}" alt="avatar">
          </div>
          <div class="user__name">${nickName}</div>
        </div>
        <div class="newsline__main">
          <img class="newsline__main-img" src="${img}" alt="image">
        </div>
        <div class="newsline__footer">
          <div class="icons">
            <div class="icons-block">
                <span class="icons__like ${likeBlack}"></span>
                <span class="icons__comment"></span>
            </div>
            <p class="count"><span class="count-likes">${likes}</span> likes</p>
          </div>
          <div class="post">
            <p class="post__text">${postText}</p>
            <div class="more-text">... more</div>
            <p class="post__time">Published: <span class="time-ago">${time}</span></p>
            <a class="post__comment">View all comments (<span class="count-comment">${numberComment}</span>)</a>
          </div>
          <div class="comments-all"></div>
          <div class="comment">
            <textarea class="comment__input" placeholder="Add a comment..."></textarea>
            <button class="comment__btn">Post</button>
          </div>
        </div>
      </div>
    `;
}

export default postView;
