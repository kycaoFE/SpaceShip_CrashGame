import { Label, Button } from 'cc';
import { _decorator, Component, Node } from 'cc';

import { Data, } from '../Common/Data';

import { FormatMoney } from '../Common/formatMoneyVi';
const money = new FormatMoney();

const { ccclass, property } = _decorator;
@ccclass('PreparingController')
export class PreparingController extends Component {

    @property(Button) subButton: Button;
    @property(Button) minusButton: Button;

    @property(Node) panelChangeValue: Node;

    @property(Label) valueLabel: Label;

    private isBet: boolean = true;
    private isPress: boolean = false;

    private betStepValue: number;
    private ratioStepValue: number;
    private timePressCurrent: number;
    private timeIsHold: number = 0.2;
    private countHoldNum: number = 0;

    private stateButton: string = '';

    start() {
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
        if (isBetValue && value <= Data.instance.minBetValue) {
            this.minusButton.interactable = false;
            this.subButton.interactable = true;
            this.valueLabel.string = money.formatMoney(value);
            return;
        }
        if (value <= 0) {
            this.minusButton.interactable = false;
            this.subButton.interactable = true;
            return;
        }

        this.minusButton.interactable = true;
        this.subButton.interactable = true;
        if (isBetValue) {
            this.valueLabel.string = money.formatMoney(value);
            if (value >= Data.instance.walletAmount) {
                this.minusButton.interactable = true;
                this.subButton.interactable = false;
            }
            return;
        }
        if (value >= Data.instance.maxRatioStopValue) {
            this.minusButton.interactable = true;
            this.subButton.interactable = false;
        }
        else {
            this.minusButton.interactable = true;
            this.subButton.interactable = true;
        }
        this.valueLabel.string = value.toFixed(1);
    }

    subClick() {
        if (this.isBet) {
            Data.instance.betValue = Data.instance.betValue + this.betStepValue;
            this.setValueLabel(Data.instance.betValue, true);
            return;
        }
        Data.instance.ratioValue = Data.instance.ratioValue + this.ratioStepValue;
        this.setValueLabel(Data.instance.ratioValue, false);
    }

    minusClick() {
        if (this.isBet) {
            Data.instance.betValue = Data.instance.betValue - this.betStepValue;
            this.setValueLabel(Data.instance.betValue, true);
            return;
        }
        Data.instance.ratioValue = Data.instance.ratioValue - this.ratioStepValue;
        this.setValueLabel(Data.instance.ratioValue, false);
    }

    registerEventHold(node: Node, stateButton: string) {
        node.on(Node.EventType.TOUCH_START, (event) => {
            this.isPress = true;
            this.timePressCurrent = 0;
            this.timeIsHold = 0.2;
            this.stateButton = stateButton;
        })
        node.on(Node.EventType.TOUCH_END, (event) => {
            this.isPress = false;
            this.stateButton = '';
            this.countHoldNum = 0;
            this.betStepValue = Data.instance.betStepDefault;
            this.ratioStepValue = Data.instance.ratioStepDefault;
        })
    }

    limitTimeHold() {
        if (this.timeIsHold <= 0.05) {
            this.timeIsHold = 0.05;
        }
    }

    checkEventHold(...callback: Array<Button>) {
        this.limitTimeHold();
        if (this.timePressCurrent >= this.timeIsHold) {
            this.timePressCurrent = 0;
            this.timeIsHold -= 0.01;
            this.countHoldNum++;
            if(this.countHoldNum >= 10){
                this.betStepValue += 100;
                this.ratioStepValue += 0.1;
            }
            switch (this.stateButton) {
                case 'sub':
                    this.subClick();
                    break;
                case 'minus':
                    this.minusClick();
                    break;
            }
        }
    }
}

