import { Label, Button } from 'cc';
import { _decorator, Component, Node } from 'cc';

import { Data,  } from '../Common/Data';

import { FormatMoney } from '../Common/formatMoneyVi';
const money = new FormatMoney();

const { ccclass, property } = _decorator;
@ccclass('PreparingController')
export class PreparingController extends Component {

    @property(Button) subButton: Button;
    @property(Button) minusButton: Button;

    @property(Node) panelChangeValue: Node;
    @property(Node) ui: Node;

    @property(Label) valueLabel: Label;

    private isBet: boolean = true;
    private isPress: boolean = false;

    private betStepValue: number;
    private ratioStepValue: number;
    private timePressCurrent: number;
    private timeIsHold: number = 0.2;
    private countHoldNum: number = 0;

    private stateButton: string = '';

    private uiController: any;

    start() {
        this.uiController = this.ui.getComponent('UIController');
        this.registerEventHold(this.subButton.node, 'sub');
        this.registerEventHold(this.minusButton.node, 'minus');
        this.betStepValue = Data.instance.betStepDefault;
        this.ratioStepValue = Data.instance.ratioStepDefault;
        this.setDefault();
    }

    update(deltaTime: number) {
        if (!this.isPress) return;
        this.timePressCurrent += deltaTime;

        this.checkEventHold()
    }

    setDefault() {
        this.activePanel(false, false);
    }

    activePanel(status: boolean, isBet: boolean) {
        this.uiController.buttonChangeShip.active = !status;
        this.panelChangeValue.active = status;
        this.isBet = isBet;
        if (isBet) {
            this.setValueLabel(Data.instance.betValue, true);
        }
        else {
            this.setValueLabel(Data.instance.ratioValue, false);
        }

    }

    setValueLabel(value: number, isBetValue: boolean) {
        this.minusButton.interactable = true;
        this.subButton.interactable = true;
        if (isBetValue) {
            if(value <= Data.instance.minBetValue) {
                this.valueLabel.string = '--';
                this.uiController.enableButtonStart(false);
            }
            else {
                this.valueLabel.string = money.formatMoney(value);
                this.uiController.enableButtonStart(true);
            }
            if (value >= Data.instance.walletAmount) {
                this.minusButton.interactable = true;
                this.subButton.interactable = false;
            }
            return;
        }
        if (value >= Data.instance.maxRatioValue) {
            this.minusButton.interactable = true;
            this.subButton.interactable = false;
        }
        else {
            this.minusButton.interactable = true;
            this.subButton.interactable = true;
        }
        if(value <= 0) {
            this.valueLabel.string = 'NONE';
            return;
        }
        this.valueLabel.string = value.toFixed(1);
        if (value < 0) {
            this.minusButton.interactable = false;
            this.subButton.interactable = true;
            return;
        }
    }

    subClick() {
        if (this.isBet) {
            Data.instance.betValue = Data.instance.betValue + Data.instance.betStep;
            this.setValueLabel(Data.instance.betValue, true);
            return;
        }
        Data.instance.ratioValue = Data.instance.ratioValue + Data.instance.ratioStep;
        this.setValueLabel(Data.instance.ratioValue, false);
    }

    minusClick() {
        if (this.isBet) {
            Data.instance.betValue = Data.instance.betValue - Data.instance.betStep;
            this.setValueLabel(Data.instance.betValue, true);
            return;
        }
        Data.instance.ratioValue = Data.instance.ratioValue - Data.instance.ratioStep;
        this.setValueLabel(Data.instance.ratioValue, false);
    }

    registerEventHold(node: Node, stateButton: string) {
        node.on(Node.EventType.TOUCH_START, (event) => {
            if(stateButton == 'sub') this.subClick();
            if(stateButton == 'minus') this.minusClick();
            this.isPress = true;
            this.timePressCurrent = 0;
            this.timeIsHold = 0.2;
            this.stateButton = stateButton;
            console.warn('start touch');
        })
        node.on(Node.EventType.TOUCH_END, (event) => {
            this.isPress = false;
            this.stateButton = '';
            this.countHoldNum = 0;
            Data.instance.betStep = Data.instance.betStepDefault;
            Data.instance.ratioStep = Data.instance.ratioStepDefault;
            console.warn('end touch');
        })
    }

    limitTimeHold(value: number) {
        if (this.timeIsHold <= value) {
            this.timeIsHold = value;
        }
    }

    setStepValue(){
        Data.instance.betStep = this.betStepValue;
        Data.instance.ratioStep = this.ratioStepValue;
    }

    checkEventHold() {
        if (this.timePressCurrent >= this.timeIsHold) {
            this.timePressCurrent = 0;
            this.timeIsHold -= 0.01;
            this.limitTimeHold(0.01);
            this.countHoldNum++;
            switch (this.stateButton) {
                case 'sub':
                    if(this.countHoldNum >= 10){
                        this.betStepValue += 1;
                        this.ratioStepValue += 0.1;
                        this.setStepValue();
                        this.countHoldNum = 0;
                    }
                    this.subClick();
                    break;
                case 'minus':
                    if(this.countHoldNum >= 10){
                        this.betStepValue -= 1;
                        this.ratioStepValue -= 0.1;
                        this.setStepValue();
                        this.countHoldNum = 0;
                    }
                    this.minusClick();
                    break;
            }
        }
        // console.warn(this.betStepValue, this.ratioStepValue);
    }
}

