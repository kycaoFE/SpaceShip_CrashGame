import { _decorator, Component, Node, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PopupController')
export class PopupController extends Component {
    @property(Label) lblContext: Label = null;

    setContext(context: string){
        this.lblContext.string = context;
    }
}

