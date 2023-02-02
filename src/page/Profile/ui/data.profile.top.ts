import './style/block.profile.scss';

function dataProfileTop(name: string): string {
    return `
    <div class="block__profile">
        <span>${name}</span>
        <button>Подписки</button>
        <button>Отправить Сообщение</button>
    </div>
    `;
}

export default dataProfileTop;
