import { Data } from '../Common/Data';
import { Color } from 'cc';
import { Button } from 'cc';
import { Label } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { ChangeMoney } from '../Common/ChangeMoney';
const { ccclass, property } = _decorator;

const money = new ChangeMoney();

@ccclass('UIController')
export class UIController extends Component {
    @property(Node) popup: Node = null;
    @property(Node) PreparingControllerNode: Node;
    @property(Node) PreparingArea: Node;
    @property(Node) PanelChangeValue: Node;
    @property(Node) moneyWin: Node;
    @property(Label) moneyWinLabel: Label;

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
        this.moneyWin.active = false;
        this.moneyWinLabel.string = '0';
        this.popup.active = false;
        this.muL.node.active = false;
        this.PreparingArea.active = false;
        this.betValueLabel.string = money.changeMoney(Data.instance.betValue);
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
            this.betValueLabel.string = money.changeMoney(Data.instance.betValue);
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
        this.moneyWin.active = true;
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
        const moneyWin = money.changeMoney(Number(value)*Data.instance.betValue)
        this.moneyWinLabel.string = moneyWin;
    }

    preparing(){
        this.openPrepareArea(true);
        this.moneyWin.active = false;
        this.buttonStart.node.active = true;
        this.muL.color = Color.WHITE;
    }

    public setModeButton(mode: string){
        this.startLabel.string = mode;
        this.startLabel.color = Color.BLACK;
    }
}

