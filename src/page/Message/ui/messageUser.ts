import '../view/messagePage.scss';

function messageUser(name: string): string {
    return `
      <div class="message-user">
          <div class="message-avatar"></div>
          <div class="message-content">
            <p class="message-content-title">${name}</p>
            <p class="message-content-subtitle">Imperdiet in sit fdhgdfhddhd</p>
          </div>
      </div>
    `;
}

export default messageUser;
