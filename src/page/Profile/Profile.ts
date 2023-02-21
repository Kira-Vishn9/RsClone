import Base from '../../app/base/Base';
import Observer from '../../app/observer/Observer';
import AnotherProfileModel from './model/AnotherProfileModel';
import ProfileModel from './model/ProfileModel';
import EventType from './types/EventType';
import AnotherProfileView from './view/AnotherProfileView';
import ProfileView from './view/ProfileView';
enum ProfileState {
    OWN_PROFILE,
    ANOTHER_PROFILE,
}

class Profile extends Base {
    private observer: Observer = new Observer();

    private view: ProfileView = new ProfileView(this.observer);
    private model: ProfileModel = new ProfileModel(this.observer);

    private anotherModel: AnotherProfileModel = new AnotherProfileModel(this.observer);
    private anotherView: AnotherProfileView = new AnotherProfileView(this.observer);

    private state: ProfileState = ProfileState.OWN_PROFILE;

    public mount(): void {
        this.mountState();
        this.observer.subscribe(EventType.RERENDER, this.onReRender);
    }

    public unmount(): void {
        this.observer.unsubscribe(EventType.RERENDER, this.onReRender);
        this.unmountState();
    }

    public render(): string {
        this.checkCurrentRoute();

        switch (this.state) {
            case ProfileState.OWN_PROFILE:
                return this.view.make();

            case ProfileState.ANOTHER_PROFILE:
                return this.anotherView.make();
        }
    }

    private mountState(): void {
        switch (this.state) {
            case ProfileState.OWN_PROFILE:
                this.model.mount();
                this.view.init();
                break;
            case ProfileState.ANOTHER_PROFILE:
                this.anotherModel.mount();
                this.anotherView.init();
                break;
        }
    }

    private unmountState(): void {
        switch (this.state) {
            case ProfileState.OWN_PROFILE:
                this.model.unmount();
                this.view.unmount();
                break;
            case ProfileState.ANOTHER_PROFILE:
                this.anotherModel.unmount();
                this.anotherView.unmount();
                break;
        }
    }

    // TODO Мега Костыльный Способ << need Refactor
    private checkCurrentRoute(): void {
        let val = window.location.hash;
        val = val.replace('#/', '');

        const valSplit = val.split('/');

        if (valSplit.length > 1) {
            this.state = ProfileState.ANOTHER_PROFILE;
        } else {
            this.state = ProfileState.OWN_PROFILE;
        }
    }

    private onReRender = () => {
        this.render();
    };
}

export default Profile;
