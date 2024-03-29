import { _decorator, Component, Node, isValid } from 'cc';
import { Network } from '../Network/Network';
import { Label } from 'cc';
import { FormatMoney } from '../Common/formatMoneyVi';
import gaEventEmitter from '../../../cc-common/cc30-arcade-base/Scripts/Common/gaEventEmitter';
import EventCode from '../Common/EventCode';
import { Data } from '../Common/Data';
import { Color } from 'cc';
import { tween } from 'cc';
import { Vec3 } from 'cc';

const network = new Network();
const money = new FormatMoney()

const { ccclass, property } = _decorator;

@ccclass('userInfoController')
export class userInfoController extends Component {

    @property(Label) walletLabel: Label;
    @property(Label) moneyBet: Label;

    start() {
        gaEventEmitter.instance.registerEvent(EventCode.REQUEST.UPDATE_WALLET, this.updateWallet.bind(this));
        gaEventEmitter.instance.registerEvent(EventCode.RESPONSE.CLAIM_GAME, this.changeWalletWin.bind(this));
        this.moneyBet.node.active = false;
        this.walletLabel.node.parent.active = false;
    }

    update(deltaTime: number) {
        
    }

    updateWallet(data){
        this.walletLabel.node.parent.active = true;
        const walletAmount = (data - 2493)/1000;
        Data.instance.walletAmount = walletAmount;
        this.walletLabel.string = money.formatMoney(walletAmount);
    }

    changeWalletStart(){
        this.moneyBet.node.active = true;
        this.moneyBet.string = '-'+money.formatMoney(Data.instance.betValue);
        this.moneyBet.color = Color.RED;
        this.moneyBet.node.position = new Vec3(-10, -70, 0);
        Data.instance.walletAmount -= Data.instance.betValue;
        this.walletLabel.string =  money.formatMoney(Data.instance.walletAmount);
        tween(this.moneyBet.node)
        .to(0.5, {position: new Vec3(-10, -120, 0)})
        .call(()=>{
            this.moneyBet.node.active = false;
        })
        .start()
    }

    changeWalletWin(data){
        const moneyWin = data.player.wa
        Data.instance.walletAmount += moneyWin/1000;
        this.moneyBet.node.active = true;
        this.moneyBet.string = '+'+money.formatMoney(moneyWin/1000);
        this.moneyBet.color = Color.GREEN;
        this.moneyBet.node.position = new Vec3(-10, -120, 0);
        tween(this.moneyBet.node)
        .to(1, {position: new Vec3(-10, -70, 0)})
        .call(()=>{
            this.walletLabel.string = money.formatMoney(Data.instance.walletAmount);
            this.moneyBet.node.active = false;
        })
        .start()
    }
}

