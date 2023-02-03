import './messagePage.scss';

const messagePage = `
  <div class="message-block">
    <div class="message-block__left">
      <div class="message-block__left-header">
        <span class="message-name">nickname</span>
        <div class="message-btn"></div>
      </div>
      <div class="message-block__left-main">
        <div class="message-user">
          <div class="message-avatar"></div>
          <div class="message-content">
            <p class="message-content-title">Lorem ipsum</p>
            <p class="message-content-subtitle">Imperdiet in sit fdhgdfhddhd</p>
          </div>
        </div>

        <div class="message-user">
          <div class="message-avatar"></div>
            <div class="message-content">
              <p class="message-content-title">Lorem ipsum</p>
              <p class="message-content-subtitle">Imperdiet in sit fdhgdfhddhd</p>
            </div>
          </div>
        </div>
      </div>
    <div class="message-block__right">
      <div class="message-block__right-img"></div>
      <p class="message-block__right-title">Your Messages</p>
      <p class="message-block__right-text">Send private photos and messages to a friend or group.</p>
      <button class="send-btn">Send Message</button>
    </div>
  </div>
`;

export default messagePage;
