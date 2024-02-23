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

    start() {
        this.betStepValue = 100;
        this.ratioStepValue = 0.1;
        Data.instance.betValue = 100;
        Data.instance.ratioValue = 10.0;
        this.setDefault();
    }

    update(deltaTime: number) {
        
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
        if(value <=0) {
            this.minusButton.interactable = false;
            this.subButton.interactable = true; 
            return;
        }

        this.minusButton.interactable = true;
        this.subButton.interactable = true; 
        if(isBetValue) {
            this.valueLabel.string = money.changeMoney(value);
            if(value > Data.instance.walletAmount){
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
        this.valueLabel.string = value.toString();
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

