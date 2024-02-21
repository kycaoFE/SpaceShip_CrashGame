import { Vec3 } from 'cc';
import { tween } from 'cc';
import { _decorator, Component, Node } from 'cc';
import gaEventEmitter from '../../../cc-common/cc30-arcade-base/Scripts/Common/gaEventEmitter';
import EventCode from '../Common/EventCode';
const { ccclass, property } = _decorator;

@ccclass('AstronautController')
export class AstronautController extends Component {

    start() {
        gaEventEmitter.instance.registerEvent(EventCode.RESPONSE.CLAIM_GAME, this.jumpOut.bind(this));
        this.node.active = false;
    }

    jumpOut(){
        tween(this.node)
        .by(2, {position: new Vec3(0, -700, 0)})
        .call(()=>{
            this.node.active = false;
        })
        .start();
    }
}

