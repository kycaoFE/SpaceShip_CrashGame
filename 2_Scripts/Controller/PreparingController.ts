import { Data } from '../Common/Data';
import gaEventEmitter from '../../../cc-common/cc30-arcade-base/Scripts/Common/gaEventEmitter';
import { Label } from 'cc';
import { Button } from 'cc';

import { _decorator, Component, Node } from 'cc';
import { ChangeMoney } from '../Common/ChangeMoney';

const money = new ChangeMoney();
const { ccclass, property } = _decorator;

@ccclass('PreparingController')
export class PreparingController extends Component {

    @property(Button) subButton: Button;
    @property(Button) minusButton: Button;

    @property(Node) panelChangeValue: Node;

    @property(Label) valueLabel: Label;

    private isBet : boolean = true; 

    private betStepValue: number;
    private ratioStepValue: number;
    private isPress: boolean = false;
    private isSub: boolean = false;
    private timePressCurrent: number;
    private timeIsHold: number =  0.2;

    start() {
        this.subButton.node.on(Node.EventType.TOUCH_START, (event)=>{
            this.isPress = true;
            this.timePressCurrent = 0;
            this.timeIsHold = 0.2;
            this.isSub = true;
        })
        this.subButton.node.on(Node.EventType.TOUCH_END, (event)=>{
            this.isPress = false;
        })
        this.minusButton.node.on(Node.EventType.TOUCH_START, (event)=>{
            this.isPress = true;
            this.timePressCurrent = 0;
            this.timeIsHold = 0.2;
            this.isSub = false;
        })
        this.minusButton.node.on(Node.EventType.TOUCH_END, (event)=>{
            this.isPress = false;
        })
        this.betStepValue = 100;
        this.ratioStepValue = 0.1;
        this.setDefault();
    }

    update(deltaTime: number) {
        if(!this.isPress) return;

        this.timePressCurrent += deltaTime;
        if(this.timeIsHold <= 0.05){
            this.timeIsHold = 0.05;
        }
        if(this.timePressCurrent >= this.timeIsHold && this.isSub){
            this.timePressCurrent = 0;
            this.timeIsHold -= 0.01;
            this.subClick()
        }
        else if(this.timePressCurrent >= this.timeIsHold && !this.isSub){
            this.timePressCurrent = 0;
            this.timeIsHold -= 0.01;
            this.minusClick()
        }
    }

    setDefault(){
        this.activePanel(false, false);
    }

    activePanel(status: boolean, isBet: boolean) {
        this.panelChangeValue.active = status;
        this.isBet = isBet;
        if(isBet) {
            this.setValueLabel(Data.instance.betValue, true);
        }
        else{
            this.setValueLabel(Data.instance.ratioValue, false);
        }
        
    }

    subClick(){
        if(this.isBet) {
            this.subBet();
            this.setValueLabel(Data.instance.betValue, true);
            return;
        }
        this.subRatio();
        this.setValueLabel(Data.instance.ratioValue, false);
    }

    minusClick(){
        if(this.isBet) {
            this.minusBet();
            this.setValueLabel(Data.instance.betValue, true);
            return;
        }
        this.minusRatio();
        this.setValueLabel(Data.instance.ratioValue, false);
    }

    setValueLabel(value: number, isBetValue: boolean){
        if(isBetValue && value <= 100) {
            this.minusButton.interactable = false;
            this.subButton.interactable = true; 
            this.valueLabel.string = money.changeMoney(value);
            return;
        }
        if(value <= 0) {
            this.minusButton.interactable = false;
            this.subButton.interactable = true; 
            return;
        }

        this.minusButton.interactable = true;
        this.subButton.interactable = true; 
        if(isBetValue) {
            this.valueLabel.string = money.changeMoney(value);
            if(value >= Data.instance.walletAmount){
                this.minusButton.interactable = true;
                this.subButton.interactable = false;   
            }
            return;
        }
        if(value >= 10) {
            this.minusButton.interactable = true;
            this.subButton.interactable = false;   
        }
        else {
            this.minusButton.interactable = true;
            this.subButton.interactable = true;   
        }
        this.valueLabel.string = value.toFixed(1);
    }

    subBet(){
        Data.instance.betValue = Data.instance.betValue + this.betStepValue;
    }

    minusBet(){
        Data.instance.betValue = Data.instance.betValue - this.betStepValue;
    }

    subRatio(){
        Data.instance.ratioValue = Data.instance.ratioValue + this.ratioStepValue;
    }

    minusRatio(){
        Data.instance.ratioValue = Data.instance.ratioValue - this.ratioStepValue;
    }

}

