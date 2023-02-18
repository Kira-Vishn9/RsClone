import { DataSnapshot } from 'firebase/database';
import Observer from '../../../app/observer/Observer';
import EventType from '../type/EventType';
import './style.scss';

class Chat {
    private root: HTMLElement | null = null;
    private send : HTMLElement | null = null;
    private input: HTMLInputElement | null = null;
    private obServer: Observer;
    private placeMessage: HTMLElement | null = null;

    constructor(obServer: Observer){
        this.obServer = obServer;
    }


   public init (parent: HTMLElement) {
    this.root = parent.querySelector('.wrapper-dialog-wondow');
    if (this.root === null) return;
    this.send = this.root.querySelector('.submit');
    this.send?.addEventListener('click', this.sendMessage);
    this.input = this.root.querySelector('#message');
    this.obServer.subscribe(EventType.messageback, this.newmessage);
    this.placeMessage = this.root.querySelector('.place-for-message');
   }

   public make () {
    const html = `
    <div class="wrapper-dialog-wondow">
    <div class="conteiner-user">
        <div>
            <img class="user-photo"
            src="" alt="photoUser">
            <>
        </div>
        <div>
            <p class="user_name"></p>
        </div>
    </div>
    <div class="place-for-message">
    </div>
    <div class="wrapper-input">
        <textarea name="message" id="message" cols="" rows=""></textarea>
        <span class="submit"></span>
    </div>
</div>
    `
    return html;
  }

public sendMessage = () => {
    const message = this.input?.value;
    this.obServer.emit(EventType.message, message);
    if (this.input === null) return
    this.input.value = '';
}

public newmessage = (data: DataSnapshot) => {
    if(data.val().name != "kira") {
        const divData = `
        <div class="interlocutor">
        <img  src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg" alt="userPhoto">
        <span>${data.val().message}</span>
        </div>
        `;
        if (this.placeMessage === null) return;
        this.placeMessage.insertAdjacentHTML('beforeend', divData);
    }else{
        const divData = `
        <div class="you-message">
        <span>${data.val().message}</span>
        </div>
        `;
        if (this.placeMessage === null) return;
        this.placeMessage.insertAdjacentHTML('beforeend', divData);
    }
}
}
export default Chat;