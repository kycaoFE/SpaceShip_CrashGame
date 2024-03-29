import { Data } from '../Common/Data';
import { Color } from 'cc';
import { Button } from 'cc';
import { Label } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { FormatMoney } from '../Common/formatMoneyVi';
import { Sprite } from 'cc';
import gaEventEmitter from '../../../cc-common/cc30-arcade-base/Scripts/Common/gaEventEmitter';
import gaEventsCode from '../../../cc-common/cc30-arcade-base/Scripts/Definitions/gaEventsCode';
import { tween } from 'cc';
import { ProgressBar } from 'cc';
import { Vec3 } from 'cc';
const { ccclass, property } = _decorator;

const money = new FormatMoney();

@ccclass('UIController')
export class UIController extends Component {
    @property(Node) popup: Node = null;
    @property(Node) PreparingControllerNode: Node;
    @property(Node) PreparingArea: Node;
    @property(Node) PanelChangeValue: Node;
    @property(Node) moneyWin: Node;
    @property(Node) userInfoController: Node;
    @property(Node) buttonChangeShip: Node;
    @property(Sprite) moneyWinSprite: Sprite;
    @property(Label) moneyWinLabel: Label;

    @property(Label) muL: Label = null;

    @property(Button) betValueButton: Button;
    @property(Button) ratioValueButton: Button;

    @property(Label) betValueLabel: Label;
    @property(Label) ratioValueLabel: Label;

    @property(Button) buttonStart: Button;
    @property(Label) startLabel: Label;

    @property(ProgressBar) flyProgressBar: ProgressBar;
    @property(Node) iconFlyProgressBar: Node;

    betButtonStatus: boolean = false;
    ratioButtonStatus: boolean = false;

    private popupController: any;
    private preparingController: any;
    private _userInfoController: any;

    protected onLoad(): void {
        this.popupController = this.popup.getComponent('PopupController');
        this.setDefault();
    }

    start() {
        this.preparingController = this.PreparingControllerNode.getComponent('PreparingController');
        this._userInfoController = this.userInfoController.getComponent('userInfoController');

    }

    setDefault(){
        this.flyProgressBar.node.active = false;
        this.moneyWinLabel.string = '0K';
        this.moneyWin.active = false;
        this.buttonStart.node.active = false;
        this.popup.active = false;
        this.muL.node.active = false;
        this.PreparingArea.active = false;
        this.buttonChangeShip.active = true;
        this.betValueLabel.string = '--';
        this.ratioValueLabel.string = 'NONE';
        this.enableButtonStart(false);
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
        if(this.ratioButtonStatus){
            this.clickRatioButton();
        }
        this.betButtonStatus = !this.betButtonStatus;
        if(this.betButtonStatus){
            this.preparingController.activePanel(true, true);
            this.betValueLabel.string = 'X';
            this.betValueButton.node.getComponent(Sprite).color = Color.RED;
        }
        else{
            this.preparingController.activePanel(false, true);
            this.betValueButton.node.getComponent(Sprite).color = Color.WHITE;
            if(Data.instance.betValue <= 0) {
                this.betValueLabel.string = '--';
                return;
            }
            this.betValueLabel.string = money.formatMoney(Data.instance.betValue);

        }
    }

    clickRatioButton(){
        if(this.betButtonStatus){
            this.clickBetButton();
        }
        this.ratioButtonStatus = !this.ratioButtonStatus;
        if(this.ratioButtonStatus){
            this.preparingController.activePanel(true, false);
            this.ratioValueLabel.string = 'X';
            this.ratioValueButton.node.getComponent(Sprite).color = Color.RED;
        }
        else{
            this.preparingController.activePanel(false, false);
            this.ratioValueButton.node.getComponent(Sprite).color = Color.WHITE;
            if(Data.instance.ratioValue == 0){
                this.ratioValueLabel.string = 'NONE';
                return;
            }
            this.ratioValueLabel.string = Data.instance.ratioValue.toFixed(1);
        }
    }

    startGame(){
        if(this.betButtonStatus){
            this.clickBetButton();
        }

        if(this.ratioButtonStatus){
            this.clickRatioButton();
        }
        this.flyProgressBar.node.active = true;
        this.moneyWin.active = true;
        this.setMuL('0.0');
        this.iconFlyProgressBar.position = new Vec3(-140,0,0)
        this.updateFylProgressBar(0.0);
        this.openPrepareArea(false);
        this.startLabel.string = 'CASH OUT';
        this.muL.color = Color.WHITE;
        this.moneyWinSprite.color = Color.WHITE;
        this.buttonStart.node.getComponent(Sprite).color = Color.GREEN;
        this.buttonStart
        this._userInfoController.changeWalletStart();
        this.buttonChangeShip.active = false;
        console.warn('startGame');
    }

    firedEvent() {
        this.buttonStart.node.active = false;
        this.muL.color = Color.RED;
        this.moneyWinSprite.color = Color.RED;
    }

    claimGame() {
        this.buttonStart.node.active = false;
        this.muL.color = Color.GREEN;
        this.moneyWinSprite.color = Color.GREEN;
    }

    setMuL(value: string){
        this.muL.node.active = true;
        this.muL.string = Number(value).toFixed(1)+`x`;
        const moneyWin = money.formatMoney(Number(value)*Data.instance.betValue)
        this.moneyWinLabel.string = moneyWin;
    }

    preparing(){
        if(Data.instance.betValue <= 0) {
            this.enableButtonStart(false);
        }
        else{
            this.enableButtonStart(true);
        }
        this.flyProgressBar.node.active = false;
        this.buttonChangeShip.active = true;
        this.openPrepareArea(true);
        this.moneyWin.active = false;
        this.buttonStart.node.active = true;
        this.muL.color = Color.WHITE;
    }

    public setModeButton(mode: string){
        this.startLabel.string = mode;
        this.startLabel.color = Color.BLACK;
    }

    uiAnimation(node: Node, duration: any, start: any, end: any, ...callback: any){
        tween(node)
        .to(duration, {position: end})
        .call(()=>{
            callback();
        })
        .start()
    }

    updateFylProgressBar(progress: number){
        this.flyProgressBar.progress = progress/10;
        this.iconFlyProgressBar.position = new Vec3((-140 + (300* progress)/10), 0, 0);
        console.log('fly: ', progress, this.iconFlyProgressBar.position)
    }

    enableButtonStart(state: boolean){
        if(state){
            this.buttonStart.interactable = true;
            this.buttonStart.node.getComponent(Sprite).color = Color.YELLOW;
            return;
        }
        this.buttonStart.interactable = false;
        this.buttonStart.node.getComponent(Sprite).color = Color.GRAY;
    }



}

