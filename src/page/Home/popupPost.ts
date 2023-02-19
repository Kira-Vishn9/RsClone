import IPosts from '../../firebase/model/IPosts';
import PostsService from '../../firebase/service/PostsService';
import { LocalStorage } from '../../localStorage/localStorage';
import Home from './Home';
import './popupPost.scss';
import HomeView from './view/HomeView';
import './view/mainHome.scss';
class PopupPost {
    // static instance: PopupPost = new PopupPost();
    private root: HTMLElement | null = null;
    private userId: string = LocalStorage.instance.getUser().id;
    private nickNameLocal: string = LocalStorage.instance.getAuthor().nickName;
    private idPost: string | null = null;
    private likesUsersArr: string[] | null = null;
    private postInfo: IPosts | undefined;
    private likeBlack = '';

    public async mount(id: string) {
        this.postInfo = await PostsService.instance.getPost(id);
        if (!this.postInfo) return;

        if (this.postInfo.likesUsers.indexOf(this.userId) !== -1) {
            this.likeBlack = 'icons__like-black';
        } else {
            this.likeBlack = '';
        }

        const popupHtml = this.makeHtml();

        if (popupHtml) {
            document.body.insertAdjacentHTML('beforeend', popupHtml);
            this.root = document.querySelector('.popap-post');
            if (this.root === null) return;

            this.viewComments();
            this.focusMessage();

            this.idPost = this.root.id;
            this.likesUsersArr = this.postInfo.likesUsers;

            this.addSubscriptions(this.root);
        }
    }

    private unmount(): void {
        //
    }

    private addSubscriptions(root: HTMLElement) {
        root.addEventListener('click', this.closePost);
        root.addEventListener('click', this.addLikeInPopup);
        root.addEventListener('click', this.addCommentInPopup);
        root.addEventListener('click', this.deletePost);
    }

    private makeHtml = (): string | undefined => {
        if (!this.postInfo) return;
        const datePost = new Date(this.postInfo.time);
        const timePost = datePost.toString().slice(3, 24);
        let disabledBtn = 'disabled';
        if (this.postInfo.userID === this.userId) {
            disabledBtn = '';
        }
        return `
            <div class="popap popap-post" id="${this.postInfo.postID}">
                <div class="popap-dark">
                    <div class="wrapper-post">
                        <div class="left-part">
                            <img class="post-image" src="${this.postInfo.fileURL}" alt="image">
                        </div>
                        <div class="right-part">
                            <div class="right-part-header">
                                <div class="popup-small-avatar"></div>
                                <div class="popup-nickname">${this.postInfo.author.nickName}</div>
                                <button class="btn-delete-post" ${disabledBtn}>Delete</button>
                            </div>
                            <div class="right-part-comments">
                                <div class="comments-wrapper">
                                    <div class="author-block">
                                        <img class="author-avatar" src="" alt="avatar">
                                        <p class="author-text"><span class="author-nickname">${this.postInfo.author.nickName}</span>${this.postInfo.text}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="right-part-footer">
                                <div class="icons">
                                    <div class="icons-block">
                                        <span class="icons__like ${this.likeBlack}"></span>
                                        <span class="icons__comment"></span>
                                        <span class="icons__save"></span>
                                    </div>
                                    <p class="count"><span class="count-likes">${this.postInfo.likesCount}</span> likes</p>
                                </div>
                                <div class="post">
                                    <p class="post__time">Published: <span class="time-ago">${timePost}</span></p>
                                </div>
                                <div class="comment">
                                    <textarea class="comment__input" placeholder="Add a comment..."></textarea>
                                    <button class="comment__btn">Post</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    };

    private deletePost = (e: Event) => {
        if (!this.root) return;
        if (e.target instanceof HTMLElement) {
            if (e.target.classList.contains('btn-delete-post')) {
                if (!this.idPost) return;
                PostsService.instance.deletePosts(this.idPost);
                this.root.remove();
                document.body.classList.remove('covert');
                // перезалить Home
                if (location.hash.includes('home')) {
                    const homeView = new HomeView();
                    homeView.init();
                }
                // перезалить Profile
            }
        }
    };

    private addLikeInPopup = (e: Event) => {
        if (e.target instanceof HTMLElement) {
            if (e.target.classList.contains('icons__like')) {
                e.target.classList.toggle('icons__like-black');
                const countLikeBlock = e.target.closest('.icons')?.querySelector('.count-likes');
                const count = countLikeBlock?.textContent;
                if (!countLikeBlock) return;
                if (!count) return;
                let countLike: number = 0;

                if (e.target.classList.contains('icons__like-black')) {
                    countLike = +count + 1;
                    countLikeBlock.textContent = `${countLike}`;
                    const index = this.likesUsersArr?.indexOf(this.userId);
                    if (index === -1) {
                        this.likesUsersArr?.push(this.userId);
                    }
                } else {
                    if (+count > 0) {
                        countLike = +count - 1;
                        countLikeBlock.textContent = `${countLike}`;
                        const index = this.likesUsersArr?.indexOf(this.userId);
                        if (index !== -1 && index !== undefined) {
                            this.likesUsersArr?.splice(index, 1);
                        }
                    }
                }
                const objUpdate = {
                    likesCount: countLike,
                    likesUsers: this.likesUsersArr,
                };
                console.log(objUpdate);
                if (!this.idPost) return;
                PostsService.instance.updatePosts(this.idPost, objUpdate);
            }
        }
    };

    private closePost = (event: Event) => {
        if (this.root === null) return;

        if (event.target instanceof HTMLElement) {
            if (event.target.classList.contains('popap-dark')) {
                this.root.remove();
                document.body.classList.remove('covert');
                this.updateHtmlPost();
            }
        }
    };

    private async updateHtmlPost() {
        const postFooter = document.querySelector(`#${this.idPost}`)?.querySelector('.newsline__footer');
        if (!postFooter) return;
        postFooter.innerHTML = '';
        const updateInfo = await this.updatePostInfoInHome();
        if (updateInfo) {
            postFooter.insertAdjacentHTML('afterbegin', updateInfo);
        }
    }

    private async updatePostInfoInHome() {
        if (this.idPost) {
            const postInfo = await PostsService.instance.getPost(this.idPost);
            if (postInfo) {
                const datePost = new Date(postInfo.time);
                const timePost = datePost.toString().slice(3, 24);

                if (postInfo.likesUsers.indexOf(this.userId) !== -1) {
                    this.likeBlack = 'icons__like-black';
                } else {
                    this.likeBlack = '';
                }

                return `
                    <div class="icons">
                        <div class="icons-block">
                            <span class="icons__like ${this.likeBlack}"></span>
                            <span class="icons__comment"></span>
                            <span class="icons__save"></span>
                        </div>
                        <p class="count"><span class="count-likes">${postInfo.likesCount}</span> likes</p>
                    </div>
                    <div class="post">
                        <p class="post__text"><span class="post__nickname">${postInfo.author.nickName}</span>${postInfo.text}</p>
                        <div class="more-text">... more</div>
                        <p class="post__time">Published: <span class="time-ago">${timePost}</span></p>
                        <a class="post__comment">View all comments (<span class="count-comment">${postInfo.comments?.length}</span>)</a>
                    </div>
                    <div class="comments-all"></div>
                    <div class="comment">
                        <textarea class="comment__input" placeholder="Add a comment..."></textarea>
                        <button class="comment__btn">Post</button>
                    </div>
                `;
            }
        }
    }

    private viewComments = () => {
        this.postInfo?.comments?.forEach((item) => {
            const html = `
                <div class="author-block">
                    <img class="author-avatar" src="" alt="avatar">
                    <p class="author-text"><span class="author-nickname">${item.nickName}</span>${item.text}</p>
                </div>
            `;
            if (!this.root) return;
            const commentBlock = this.root.querySelector('.comments-wrapper');

            commentBlock?.insertAdjacentHTML('beforeend', html);
        });
    };

    private focusMessage() {
        const iconComment = this.root?.querySelector('.icons__comment') as HTMLElement;
        const commentInput = this.root?.querySelector('.comment__input') as HTMLElement;
        iconComment.addEventListener('click', () => {
            commentInput.focus();
        });
    }

    private addCommentInPopup = async (e: Event) => {
        if (!e.target) return;
        if (!this.root) return;
        if (!this.idPost) return;
        const commentWrap = this.root.querySelector('.comments-wrapper') as HTMLElement;
        if (e.target instanceof HTMLElement) {
            if (e.target.classList.contains('comment__btn')) {
                const commentBlock = this.root.querySelector('.comment__input') as HTMLInputElement;
                if (commentBlock.value) {
                    console.log(this.nickNameLocal);
                    console.log(this.userId);
                    const html = `
                    <div class="author-block">
                    <img class="author-avatar" src="" alt="avatar">
                    <p class="author-text"><span class="author-nickname">${this.nickNameLocal}</span>${commentBlock.value}</p>
                    </div>
                    `;

                    commentWrap.insertAdjacentHTML('beforeend', html);

                    const commentsArr = this.postInfo?.comments;

                    const commentObj = {
                        nickName: this.nickNameLocal,
                        text: commentBlock.value,
                        time: Date.now(),
                    };
                    commentsArr?.push(commentObj);
                    await PostsService.instance.updatePosts(this.idPost, { comments: commentsArr });
                    commentBlock.value = '';
                }
            }
        }
    };
}

export default PopupPost;
