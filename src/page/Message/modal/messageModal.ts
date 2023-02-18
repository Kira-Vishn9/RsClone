import { list } from 'firebase/storage';
import Observer from '../../../app/observer/Observer';
import UserState from '../../../state/UserState';
import EventType from '../type/EventType';
import './style.scss';


class MessageModal {
    private root: HTMLElement | null = null; 
    private listHuman: HTMLElement | null = null;
    private next: HTMLElement | null = null;
    private observer: Observer ;
    constructor(observer: Observer){
        this.observer = observer;
    }

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
    this.root.addEventListener('click', this.removeWind)
    this.listHuman = this.root.querySelector('.list-human');
    this.next = this.root.querySelector('.next');
    this.next?.addEventListener('click', this.startDialog)
 }

 private recepientId: string = '';
 private avatarsUrl: string = '';
 private resipientName: string = '';
 public makeItem (avatarsUrl: string, name: string, userID: string) {
    const html = `
    <li class="list-item" id = '${userID}'>
    <img class="userPhoto" src="${avatarsUrl}" alt="userPhoto">
    <span class="userName">${name}</span>
    <span class="circule"></span>
    </li>
`;
    if(this.listHuman === null) return;
    this.recepientId = userID;
    this.avatarsUrl = avatarsUrl;
    this.resipientName = name;
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
        const userID = UserState.instance.UserID;
        if (userID === null) return;
        const WhatId = {
            userID: userID,
            recipientId: this.recepientId,
            recipientAvatar: this.avatarsUrl,
            recipientName: this.resipientName,
        }
        this.observer.emit(EventType.recipientDialog, WhatId);
        this.root?.remove();
        this.next?.removeEventListener('click', this.startDialog);
    }

    private removeWind = (e: Event) => {
        if(e.target instanceof HTMLElement){
            if (e.target.classList.contains('wrapper-overflow')){
                this.root?.remove();
            }
        }
    }
};


export default MessageModal;