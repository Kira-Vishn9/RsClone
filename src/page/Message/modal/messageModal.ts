import { list } from 'firebase/storage';
import './style.scss';

class MessageModal {
    private root: HTMLElement | null = null; 
    private listHuman: HTMLElement | null = null;
    private next: HTMLElement | null = null;
    constructor(
    ){}

 public make () {
    const html = `
    <div class="wrapper-overflow">
    <div class="wrapper">
        <div class="title">
            <span class="close">
                <div class="line1"></div>
                <div class="line2"></div>
            </span>
            <span>Новое сообщение</span>
            <span class="next">Далее</span>
        </div>
        <div class="search-peaple">
            <p class="who">Кому: </p>
            <input class="look_for" type="text" placeholder="Поиск...">
        </div>
        <div class="choose">
            <p>Рекомендуемые</p>
            <ul class="list-human">
            </ul>
        </div>
    </div>
 </div>
 `;

 return html;
 }

 public init (): void {
    this.root =  document.querySelector('.wrapper-overflow');
    if (this.root === null) { return } ;
    this.listHuman = this.root.querySelector('.list-human');
    this.next = this.root.querySelector('.next');
    this.next?.addEventListener('click', this.startDialog)
 }

 public makeItem (avatarsUrl: string, name: string, userID: string) {
    const html = `
    <li class="list-item" id = '${userID}'>
    <img class="userPhoto" src="${avatarsUrl}" alt="userPhoto">
    <span class="userName">${name}</span>
    <span class="circule"></span>
    </li>
`;
    if(this.listHuman === null) return;
    this.listHuman?.insertAdjacentHTML('afterbegin', html);
    this.listHuman?.addEventListener('click', this.addActive);
    
 }

    private addActive = (e: Event) => {
      if(!(e.target instanceof HTMLElement)) return
      const target = e.target;
      const up = target.closest('.list-item')
      if (up) {
        up.querySelector('.circule')?.classList.toggle('active');
        const input: HTMLInputElement | null | undefined = this.root?.querySelector('.look_for');
        if( !(input instanceof HTMLInputElement)) return;
        const textName = up.querySelector('.userName')?.textContent;
        if(textName !== undefined && textName !== null){  
            input.value = textName;}
        }
    }

    private startDialog = () => {
        this.root?.remove;
        this.next?.removeEventListener('click', this.startDialog)
    }
};


export default MessageModal;