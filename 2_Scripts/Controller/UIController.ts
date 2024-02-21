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

    @property(Button) buttonStart: Button;
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
        this.PreparingArea.active = false;
        this.betValueLabel.string = Data.instance.betValue.toString();
        this.ratioValueLabel.string = Data.instance.ratioValue.toString();
    }

    openPrepareArea(status: boolean){
        this.PreparingArea.active = status;
        this.PanelChangeValue.active = !status;
    }

    openPopup(context: string, timeOpen: number) {
        return new Promise((resolve: Function)=>{
            this.openPrepareArea(false);
            this.buttonStart.node.active = false;
            this.popup.active = true;
            this.popupController.setContext(context);
            if(timeOpen <= 0) return; 
            this.scheduleOnce(()=>{
                this.popup.active = false;
                this.openPrepareArea(true);
                this.buttonStart.node.active = true;
                resolve();
            }, timeOpen);
        })
    }

    clickBetButton(){
        this.betButtonStatus = !this.betButtonStatus;
        if(this.betButtonStatus){
            this.preparingController.activePanel(true, true);
            this.betValueLabel.string = 'X';
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
            this.ratioValueLabel.string = 'X';
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
        this.buttonStart.node.active = false;
        this.muL.color = Color.RED;
    }

    claimGame() {
        this.buttonStart.node.active = false;
        this.muL.color = Color.GREEN;
    }

    setMuL(value: string){
        this.muL.node.active = true;
        this.muL.string = value+`x`;
    }

    preparing(){
        this.openPrepareArea(true);
        this.buttonStart.node.active = true;
        this.muL.color = Color.WHITE;
    }

    public setModeButton(mode: string){
        this.startLabel.string = mode;
        this.startLabel.color = Color.BLACK;
    }
}

