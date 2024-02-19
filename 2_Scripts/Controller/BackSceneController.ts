import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

import { Data } from '../Common/Data';
import { Vec3 } from 'cc';

@ccclass('BackSceneController')
export class BackSceneController extends Component {

    private speed: number;
    public isFly: boolean;

    start() {
        this.speed = 100;
        this.isFly = false;
    }

    update(deltaTime: number) {
        if(this.isFly) {
            const mul = Data.instance.muL
            this.speed = mul*200;
            this.node.position = new Vec3(this.node.position.x, this.node.position.y - this.speed*deltaTime, this.node.position.z)
            // console.warn(this.isFly,'speed: ', Data.instance.muL);
            // console.warn(this.isFly,'backScene: ', this.node.position);
        }
    }

    restartRound(){
        this.scheduleOnce(()=>{
            this.node.position = new Vec3(0,0,0);
        }, 3);
    }
}

