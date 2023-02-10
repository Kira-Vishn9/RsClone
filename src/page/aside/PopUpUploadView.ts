import IPosts from '../../firebase/model/IPosts';
import PullPushImg from '../../firebase/pull-push-img/PullPushImg';
import PostsService from '../../firebase/service/PostsService';
import userState from '../../state/user.state';
import UserState from '../../state/UserState';
import './popapUpload.scss';

// TODO Refactoing
class PopUpUploadComponent {
    private root: HTMLElement | null = null;
    private input: HTMLInputElement | null = null;
    private inputText: HTMLInputElement | null = null;

    public mount(): void {
        document.body.insertAdjacentHTML('beforeend', this.make());
        this.root = document.querySelector('#popap-upload');
        if (this.root === null) return;

        this.input = this.root.querySelector('.upload-content__main-btn');
        document.body.classList.add('covert');

        this.root.addEventListener('click', this.onOpenClose);
        this.input?.addEventListener('change', this.onFile);
    }

    private unmount(): void {
        this.root?.removeEventListener('click', this.onOpenClose);
        this.input?.removeEventListener('change', this.onFile);
    }

    private make(): string {
        return `
        <div class="popap" id="popap-upload">
            <div class="popap-dark">
                <div class="popap-window">
                    <div class="upload-content">
                        <div class="upload-content__header">Create a post</div>
                        <div class="upload-content__main">
                            <span class="upload-content__main-img"></span>
                            <button class="upload-content__main-btn">
                            <span class = 'less'>Submit </span>
                            <input type="file"></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    private makeNewPost(src: string): string {
        return `
        <div class = 'popap-dark'>
        <div class = 'wrapper'>
          <div class="upload-content__header">Create a post</div>
          <div class="upload-content__main">
            <img class = 'img-post' src="${src}" alt="">
            <textarea class="input-text" type='text'></textarea>
            <input type="file" id="file">
            <button class="submit upload-content__main-btn">Submit</button>
          </div>
          </div>
        `;
    }

    private onOpenClose = (event: Event) => {
        if (this.root === null) return;

        if (event.target instanceof HTMLElement) {
            if (event.target.classList.contains('popap-dark')) {
                this.unmount();
                this.root.remove();
                document.body.classList.remove('covert');
            }
        }
    };

    // TODO Refactoring
    private onFile = (event: Event) => {
        if (this.root === null) return;
        if (!(event.target instanceof HTMLInputElement)) return;

        const file = event.target.files;
        if (file === null) return;

        const fileReader = new FileReader();
        fileReader.onload = () => {
            if (this.root === null) return;
            const result = fileReader.result as string;
            this.root.innerHTML = '';
            this.root.insertAdjacentHTML('afterbegin', this.makeNewPost(result));
            this.inputText = this.root.querySelector('.input-text');

            const submit = this.root
                .querySelector('.upload-content__main-btn')
                ?.addEventListener('click', async (event) => {
                    const text = this.inputText?.value; // Формирования запроса

                    // Гдето должен формировать в другом месте, в каком хз!!
                    // Формирования запроса
                    const userID = UserState.instance.UserID as string;
                    const post: IPosts = {
                        userID: userID, // Формирования запроса
                        fileName: `${userID}.${file[0].name}`, // Формирования запроса
                        fileURL: '',
                        text: text === undefined ? '' : text, // Формирования запроса
                    }; // Формирования запроса
                    console.log(post);
                    const urlImg = await PullPushImg.instance.upload(file[0], post.fileName); // Запись Картинки
                    if (typeof urlImg === 'string') {
                        post.fileURL = urlImg;
                        PostsService.instance.setPosts(post); // Запись Поста в Базу
                        document.querySelector('.popap-dark')?.remove();
                    }

                    console.log(`KEK: ${urlImg}`);
                });
        };
        fileReader.readAsDataURL(file[0]);
    };
}

export default PopUpUploadComponent;
