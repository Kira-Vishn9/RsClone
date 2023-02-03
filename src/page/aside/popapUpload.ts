import './popapUpload.scss';

function createPopap() {
    const popap = `
    <div id="popap"></div>
  `;
    console.log(1);
    document.body.insertAdjacentHTML('beforeend', popap);
}

const upload = document.querySelector('.new-posts-ico');
if (upload) {
    upload.addEventListener('click', createPopap);
}

export default createPopap;
