import './style.scss';

class MessageModal {
    private root: HTMLElement | null = null; 
    private listHuman: HTMLElement | null = null;
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
 }

 public makeItem (avatarsUrl: string, name: string, userID: string) {
    const html = `
    <li class="list-item" id = '${userID}'>
    <img class="userPhoto" src="${avatarsUrl}" alt="userPhoto">
    <span class="userName">${name}</span>
    <span class="circule"></span>
    </li>
`;
    this.listHuman?.insertAdjacentHTML('afterbegin', html);
 }


};

export default MessageModal;