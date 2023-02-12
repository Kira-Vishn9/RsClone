import '../style/search.scss';

function searchUser(nikName: string, img: string, name: string): string {
    return `
      <div class="search-user">
          <img class="search-avatar" src=${img} alt="avatar">
          <div class="search-content">
              <p class="search-title">${nikName}</p>
              <p class="search-subtitle">${name}</p>
          </div>
      </div>
    `;
}

export default searchUser;
