import messageUser from '../ui/messageUser';
import './messagePage.scss';

class MessageView {
    public init(): void {
        //
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
              ${messageUser('Loreejrhdhf')}
              ${messageUser('Loreejrhdhf')}
              ${messageUser('Loreejrhdhf')}
            </div>
          </div>
          <div class="message-block__right">
            <div class="message-block__right-header">

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
}

export default MessageView;
