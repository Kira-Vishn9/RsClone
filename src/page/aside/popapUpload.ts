import './popapUpload.scss';
import { pushkin } from '../../firebase/pull-push-img/push/pushkin';

function createPopap() {
    const popap = `
    <div class="popap" id="popap-upload">
      <div class="popap-dark">
        <div class="popap-window">
          <div class="upload-content">
            <div class="upload-content__header">Create a post</div>
            <div class="upload-content__main">
              <span class="upload-content__main-img"></span>
              <input type='file' id='file'>
              <button class="submit upload-content__main-btn">Select on computer</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

    document.body.insertAdjacentHTML('beforeend', popap);
    document.querySelector('.upload-content__main-btn')?.addEventListener('click',()=>{
      pushkin('#file', {
        multi: true,
        accept: ['.png', '.jpg', '.jpeg', '.gif']})
    } )
    document.body.classList.add('covert');

    const popapUpload = document.querySelector('#popap-upload') as HTMLElement;
    document.body.addEventListener('click', (e) => {
        if (e.target instanceof HTMLElement) {
            if (e.target.classList.contains('popap-dark')) {
                popapUpload.remove();
                document.body.classList.remove('covert');
            }
        }
    });
}

export default createPopap;
