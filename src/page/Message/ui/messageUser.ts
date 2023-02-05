import '../view/messagePage.scss';

function messageUser(name: string, message: string): string {
    return `
      <div class="message-user">
          <img class="message-avatar" src="https://amiel.club/uploads/posts/2022-03/1647762844_3-amiel-club-p-kartinki-litsa-cheloveka-3.png">
          <div class="message-content">
            <p class="message-content-title">${name}</p>
            <p class="message-content-subtitle">${message}</p>
          </div>
      </div>
    `;
}

export default messageUser;
