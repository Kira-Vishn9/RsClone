import './mainHome.scss';

const main = `
  <div class="main">
    <div class="stories">
      <div class="stories__wrapper">
        <div class="user">
          <div class="user__avatar"></div>
          <div class="user__name">@nickname</div>
        </div>
        <div class="user">
          <div class="user__avatar"></div>
          <div class="user__name">@nickname</div>
        </div>
        <div class="user">
          <div class="user__avatar"></div>
          <div class="user__name">@nickname</div>
        </div>
        <div class="user">
          <div class="user__avatar"></div>
          <div class="user__name">@nickname</div>
        </div>
        <div class="user">
          <div class="user__avatar"></div>
          <div class="user__name">@nickname</div>
        </div>
        <div class="user">
          <div class="user__avatar"></div>
          <div class="user__name">@nickname</div>
        </div>
        <div class="user">
          <div class="user__avatar"></div>
          <div class="user__name">@nickname</div>
        </div>
        <div class="user">
          <div class="user__avatar"></div>
          <div class="user__name">@nickname</div>
        </div>
      </div>
      <div class="stories__next"></div>
    </div>

    <div class="newsline">
      <div class="newsline__header">
        <div class="user__avatar small-avatar"></div>
        <div class="user__name">@nickname</div>
      </div>
      <div class="newsline__main">
        <img class="newsline__main-img" src="../../shared/Assets/image/post-1.jpg" alt="image">
      </div>
      <div class="newsline__footer">
        <div class="icons">
          <div class="icons-block">
              <span class="icons__like"></span>
              <span class="icons__comment"></span>
              <span class="icons__save"></span>
          </div>
          <p class="count"><span class="count-likes"></span>likes</p>
        </div>
        <div class="post">
          <p class="post__text"><span class="post__nickname">nickname</span>lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem </p>
          <a class="post__comment" href="#">View all comments (<span class="count-comment"></span>)</a>
          <p class="post__time"><span class="time-ago"></span> AGO</p>
        </div>
        <div class="comment">
          <textarea class="comment__input" placeholder="Add a comment..."></textarea>
          <button class="comment__btn">Post</button>
        </div>
      </div>
    </div>

    <div class="newsline">
      <div class="newsline__header">
        <div class="user__avatar small-avatar"></div>
        <div class="user__name">@nickname</div>
      </div>
      <div class="newsline__main">
        <img class="newsline__main-img" src="../../shared/Assets/image/post-2.jpeg" alt="image">
      </div>
      <div class="newsline__footer">
        <div class="icons">
          <div class="icons-block">
              <span class="icons__like"></span>
              <span class="icons__comment"></span>
              <span class="icons__save"></span>
          </div>
          <p class="count"><span class="count-likes"></span>likes</p>
        </div>
        <div class="post">
          <p class="post__text"><span class="post__nickname">nickname</span>lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem </p>
          <a class="post__comment" href="#">View all comments (<span class="count-comment"></span>)</a>
          <p class="post__time"><span class="time-ago"></span> AGO</p>
        </div>
        <div class="comment">
          <input type="text" class="comment__input" placeholder="Add a comment..."></input>
          <button class="comment__btn">Post</button>
        </div>
      </div>
    </div>

  </div>
`;

export default main;
