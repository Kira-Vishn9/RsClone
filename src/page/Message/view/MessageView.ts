import MessageModal from '../modal/messageModal';
import messageUser from '../ui/messageUser';
import './messagePage.scss';

class MessageView {
    private sendBth: HTMLElement | null = null;
    private root: HTMLElement | null = null;
    public init(): void {
        this.root = document.querySelector('.message-block');
        if (this.root) {
            this.root.addEventListener('click', this.showMessage);
        } else {
            return;
        }
        this.sendBth = this.root.querySelector('.send-btn');
        this.sendBth?.addEventListener('click', this.openModalM)
    }

    public unmount(): void {
        //
    }

    public make(): string {
        return `
        <div class="message-block">
          <div class="message-block__left">
            <div class="message-block__left-header">
              <span class="message-name">nickname</span>
              <div class="message-btn"></div>
            </div>
            <div class="message-block__left-main">
              ${messageUser('Tomas', 'hello')}
              ${messageUser('Tomas', 'hello')}
              ${messageUser('Tomas', 'hello')}
            </div>
          </div>
          <div class="message-block__right">
            <div class="message-block__right-header hidden">
              <a class="user-message" href="#">
                <img class="user-avatar" src="https://amiel.club/uploads/posts/2022-03/1647762844_3-amiel-club-p-kartinki-litsa-cheloveka-3.png" alt="avatar">
                <span class="user-name">Tomas</span>
              </a>
            </div>
            <div class="message-block__right-main">
              <div class="message-block__right-img"></div>
              <p class="message-block__right-title">Your Messages</p>
              <p class="message-block__right-text">Send private photos and messages to a friend or group.</p>
              <button class="send-btn">Send Message</button>
            </div>
          </div>
        </div>
      `.trim();
    }

    private showMessage(): void {
        const messageInfo = document.querySelector('.message-block__right-header');
        const messageBlock = document.querySelector('.message-block__right-main');
        if (messageInfo && messageBlock) {
            messageInfo.classList.remove('hidden');
            messageBlock.innerHTML = '';
        }
    }

    private openModalM = () => {
      console.log('hi')
      const messageModal = new MessageModal();
      this.root?.insertAdjacentHTML('afterbegin', messageModal.make());
      messageModal.init();
      messageModal.makeItem("https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg", "Kira");
    }
}

export default MessageView;
