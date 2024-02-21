import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

import { Data } from '../Common/Data';
import { Vec3 } from 'cc';
import gaEventEmitter from '../../../cc-common/cc30-arcade-base/Scripts/Common/gaEventEmitter';
import EventCode from '../Common/EventCode';

@ccclass('BackSceneController')
export class BackSceneController extends Component {

    private speed: number;
    public isFly: boolean;

    start() {
        this.speed = 100;
        this.isFly = false;

        gaEventEmitter.instance.registerEvent(EventCode.RESPONSE.CLAIM_GAME, ()=>{
            this.speed = 300;
        })
    }

    update(deltaTime: number) {
        if(this.isFly) {
            const mul = Data.instance.muL
            this.speed = mul*200;
            this.node.position = new Vec3(this.node.position.x, this.node.position.y - this.speed*deltaTime, this.node.position.z)
        }
    }

    restartRound(){
            this.node.position = new Vec3(0,0,0);
    }
}

