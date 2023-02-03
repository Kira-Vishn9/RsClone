import '../style/profile.scss';
import dataProfile from '../ui/data-profile';
import dataProfileTop from '../ui/data.profile.top';
import itemProfile from '../ui/item-profile';

class ProfileView {
    public init(): void {
        //
    }

    public unmount(): void {
        //
    }

    public make(): string {
        return `
            <section class="profile">

                <div class="data__profile">
                    <img src="https://kipmu.ru/wp-content/uploads/jptr-1.jpg">
                    <div>
                        ${dataProfileTop('Jupiter')}
                        ${dataProfile(154, 147, 577)}
                        <span>Jupiter Sprogiba</span>
                    </div>
                </div>

                <div class="items-grid__profile">
                    ${itemProfile}
                    ${itemProfile}
                    ${itemProfile}
                    ${itemProfile}
                    ${itemProfile}
                    ${itemProfile}
                </div>
            </section>
        `.trim();
    }
}

export default ProfileView;
