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
                    <img src="https://zagony.ru/admin_new/foto/2018-1-29/1517180859/devushki_iz_socialnykh_setejj_39_foto_1.jpg">
                    <div>
                        ${dataProfileTop('TanyaT34')}
                        ${dataProfile(154, 147, 577)}
                        <span>Tanya Sprogiba</span>
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
