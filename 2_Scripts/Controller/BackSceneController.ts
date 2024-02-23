import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

import { Data } from '../Common/Data';
import { Vec3 } from 'cc';
import gaEventEmitter from '../../../cc-common/cc30-arcade-base/Scripts/Common/gaEventEmitter';
import EventCode from '../Common/EventCode';

@ccclass('BackSceneController')
export class BackSceneController extends Component {

    @property(Node) Ship: Node;

    private speed: number;
    public isFly: boolean;

    start() {
        this.speed = 100;
        this.isFly = false;

        gaEventEmitter.instance.registerEvent(EventCode.RESPONSE.CLAIM_GAME, ()=>{
            this.speed = 300;
        })
        gaEventEmitter.instance.registerEvent(EventCode.RESPONSE.NORMAL_GAME, this.shipFly.bind(this));
        gaEventEmitter.instance.registerEvent(EventCode.RESPONSE.FREE_GAME, this.shipFly.bind(this));
        gaEventEmitter.instance.registerEvent(EventCode.RESPONSE.FIRED_EVENT, this.shipStopFly.bind(this));
    }

    update(deltaTime: number) {
        const mul = Data.instance.muL
        this.speed = mul*200;
        if(this.isFly && this.Ship.position.y < 0) {
            this.Ship.position = new Vec3(this.Ship.position.x, this.Ship.position.y + this.speed*deltaTime, this.Ship.position.z);
        }
        else if(this.isFly && this.Ship.position.y >= 0){
            this.node.position = new Vec3(this.node.position.x, this.node.position.y - this.speed*deltaTime, this.node.position.z)
        }
    }

    restartRound(){
        this.node.position = new Vec3(0,20,0);
    }

    shipFly(){
        this.isFly = true;
    }

    shipStopFly(){
        this.isFly = false;
    }
}

