import '../view/mainHome.scss';

function postView(nikName: string, img: string): string {
    return `
      <div class="newsline">
        <div class="newsline__header">
          <div class="user__avatar small-avatar"></div>
          <div class="user__name">${nikName}</div>
        </div>
        <div class="newsline__main">
          <img class="newsline__main-img" src="${img}" alt="image">
        </div>
        <div class="newsline__footer">
          <div class="icons">
            <div class="icons-block">
                <span class="icons__like"></span>
                <span class="icons__comment"></span>
                <span class="icons__save"></span>
            </div>
            <p class="count"><span class="count-likes">100</span> likes</p>
          </div>
          <div class="post">
            <p class="post__text"><span class="post__nickname">${nikName}</span>lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem </p>
            <a class="post__comment" href="#">View all comments (<span class="count-comment">10</span>)</a>
            <p class="post__time"><span class="time-ago">5 minute</span> AGO</p>
          </div>
          <div class="comment">
            <textarea class="comment__input" placeholder="Add a comment..."></textarea>
            <button class="comment__btn">Post</button>
          </div>
        </div>
      </div>
    `;
}

export default postView;
