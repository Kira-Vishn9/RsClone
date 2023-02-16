import './OpenImg.scss';

class OpenImg {
    private itemTarget = document.querySelector('.items-grid__profile');

    public constructor() {
        //
    }

    public Overflow = () => {
        const html = `
        <div class="conteiner-share-img">
          <img class="close" src="../shared/Assets/svg/close_icon.svg" alt="exit">
          <div class="center-content">
            <div class="photo">
            <img class="photo-post" src="../shared/Assets/image/post-2.jpeg" alt=''>
            </div>
            <div class="info-photo">
              <div class="userName"></div>
              <div class="commets">
              <div class="wrapper-user">
                    <img class='userPhoto' src="../shared/Assets/image/post-1.jpg" alt="photo">
                    <span class="userNameComment">Kvishn9</span>
              </div>
              <ul class="plase-commets">
                <li class = 'new-comment'>
                  <div
                  style="
                  display: flex;
                  align-items: center;
                    ">
                    <img src="../shared/Assets/image/post-1.jpg" class = 'user-comentator-photo' alt='photoUser'>
                    <span class= "name-comentator-photo">Regina</span>
                  </div>
                  <p class="text-comentator-photo">
                  Блин, сердце кровью обливается, вот всё у вас хорошо, посетителей нехватает чувствуется. От души советую vika_kaxova Виктория молодая опытная специалистка. с посещаемостью поможет- пишите в директ ей, ток скажите что вы от меня.
                  </p>
                </li>
                <li class = 'new-comment'>
                <div
                style="
                display: flex;
                align-items: center;
                  ">
                  <img src="../shared/Assets/image/post-1.jpg" class = 'user-comentator-photo' alt='photoUser'>
                  <span class= "name-comentator-photo">Regina</span>
                </div>
                <p class="text-comentator-photo">
                Блин, сердце кровью обливается, вот всё у вас хорошо, посетителей нехватает чувствуется. От души советую vika_kaxova Виктория молодая опытная специалистка. с посещаемостью поможет- пишите в директ ей, ток скажите что вы от меня.
                </p>
              </li>
              <li class = 'new-comment'>
              <div
              style="
              display: flex;
              align-items: center;
                ">
                <img src="../shared/Assets/image/post-1.jpg" class = 'user-comentator-photo' alt='photoUser'>
                <span class= "name-comentator-photo">Regina</span>
              </div>
              <p class="text-comentator-photo">
              Блин, сердце кровью обливается, вот всё у вас хорошо, посетителей нехватает чувствуется. От души советую vika_kaxova Виктория молодая опытная специалистка. с посещаемостью поможет- пишите в директ ей, ток скажите что вы от меня.
              </p>
            </li>
            <li class = 'new-comment'>
            <div
            style="
            display: flex;
            align-items: center;
              ">
              <img src="../shared/Assets/image/post-1.jpg" class = 'user-comentator-photo' alt='photoUser'>
              <span class= "name-comentator-photo">Regina</span>
            </div>
            <p class="text-comentator-photo">
            Блин, сердце кровью обливается, вот всё у вас хорошо, посетителей нехватает чувствуется. От души советую vika_kaxova Виктория молодая опытная специалистка. с посещаемостью поможет- пишите в директ ей, ток скажите что вы от меня.
            </p>
          </li>
          <li class = 'new-comment'>
          <div
          style="
          display: flex;
          align-items: center;
            ">
            <img src="../shared/Assets/image/post-1.jpg" class = 'user-comentator-photo' alt='photoUser'>
            <span class= "name-comentator-photo">Regina</span>
          </div>
          <p class="text-comentator-photo">
          Блин, сердце кровью обливается, вот всё у вас хорошо, посетителей нехватает чувствуется. От души советую vika_kaxova Виктория молодая опытная специалистка. с посещаемостью поможет- пишите в директ ей, ток скажите что вы от меня.
          </p>
        </li>
              </ul>
              </div>
              <div class="footer-content">
                  <img class = 'like' src="../shared/Assets/svg/like-icon-white.svg" width='30px' alt="like">
                  <img class = 'img-comment' src="../shared/Assets/svg/message-icon-white.svg" width='30px' alt="iconForComment">
                  <p>
                  <span>Нравится</span>
                  <span  class="whoLike"></span>
                  </p>
                <div class="made-comment">
                  <textarea class="text-new-comment" contenteditable="true" rows = '4' name="textarea" cols="20"  placeholder= 'add new cooment...'></textarea>
                  <button class="submit">Опубликовать</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        `;
        return html;
    };

    public targetElement(itemTarget: HTMLElement) {
        itemTarget.onclick = function (ev: Event) {
            let target = ev.target;
            if (target) {
                return target;
            }
        };
    }
}

export default OpenImg;
