import Base from '../../app/base/Base';
import Observer from '../../app/observer/Observer';
import SettingsModel from './model/SettingsModel';
import SettingsView from './view/SettingsView';

class ProfileSettings extends Base {
    private observer: Observer = new Observer();
    private view: SettingsView = new SettingsView(this.observer);
    private model: SettingsModel = new SettingsModel(this.observer);

    public mount(): void {
        console.log('MOUNT: ProfileSettings');
        this.view.init();
    }

    public unmount(): void {
        console.log('UNMOUNT: ProfileSettings');
        this.view.unmount();
    }

    public render(): string {
        return this.view.make();
    }
}

export default ProfileSettings;
