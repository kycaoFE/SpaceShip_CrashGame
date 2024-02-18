import { Data } from '../Common/Data';
import { Color } from 'cc';
import { Button } from 'cc';
import { Label } from 'cc';
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UIController')
export class UIController extends Component {
    @property(Node) popup: Node = null;
    @property(Node) PreparingControllerNode: Node;
    @property(Node) PreparingArea: Node;
    @property(Node) PanelChangeValue: Node;

    @property(Label) muL: Label = null;

    @property(Button) betValueButton: Button;
    @property(Button) ratioValueButton: Button;

    @property(Label) betValueLabel: Label;
    @property(Label) ratioValueLabel: Label;

    @property(Label) startLabel: Label;

    betButtonStatus: boolean = false;
    ratioButtonStatus: boolean = false;

    private popupController: any;
    private preparingController: any;

    protected onLoad(): void {
        this.popupController = this.popup.getComponent('PopupController');
        this.setDefault();
    }

    start() {
        this.preparingController = this.PreparingControllerNode.getComponent('PreparingController');
    }

    setDefault(){
        this.popup.active = false;
        this.muL.node.active = false;
        this.openPrepareArea(true);
        // this.betValueLabel.string = Data.instance.betValue.toString();
        // this.ratioValueLabel.string = Data.instance.ratioValue.toString();
    }

    openPrepareArea(status: boolean){
        this.PreparingArea.active = status;
        this.PanelChangeValue.active = !status;
    }

    openPopup(context: string, timeOpen: number) {
        console.log(context);
        this.popup.active = true;
        this.popupController.setContext(context);
        if(timeOpen <= 0) return;
        this.scheduleOnce(()=>{
            this.popup.active = false;
        }, timeOpen);
    }

    clickBetButton(){
        this.betButtonStatus = !this.betButtonStatus;
        if(this.betButtonStatus){
            this.preparingController.activePanel(true, true);
        }
        else{
            this.preparingController.activePanel(false, true);
            this.betValueLabel.string = Data.instance.betValue.toString();
        }
    }

    clickRatioButton(){
        this.ratioButtonStatus = !this.ratioButtonStatus;
        if(this.ratioButtonStatus){
            this.preparingController.activePanel(true, false);
        }
        else{
            this.preparingController.activePanel(false, false);
            this.ratioValueLabel.string = Data.instance.ratioValue.toString();
        }
    }

    startGame(){
        this.openPrepareArea(false);
        this.startLabel.string = 'CASH OUT';
        this.startLabel.color = Color.GREEN;
        this.muL.color = Color.WHITE;
        console.warn('startGame');
    }

    firedEvent() {
        this.openPrepareArea(true);
        this.startLabel.string = 'START';
        this.startLabel.color = Color.BLACK;
        this.muL.color = Color.RED;
    }

    claimGame() {
        this.openPrepareArea(true);
        this.startLabel.string = 'START';
        this.startLabel.color = Color.BLACK;
        this.muL.color = Color.GREEN;
    }

    setMuL(value: string){
        this.muL.node.active = true;
        this.muL.string = `x`+value;
    }
}

