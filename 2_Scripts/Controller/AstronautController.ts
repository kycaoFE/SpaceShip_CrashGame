import { Vec3 } from 'cc';
import { tween } from 'cc';
import { _decorator, Component, Node } from 'cc';
import gaEventEmitter from '../../../cc-common/cc30-arcade-base/Scripts/Common/gaEventEmitter';
import EventCode from '../Common/EventCode';
import { Vec2 } from 'cc';
import { RigidBody2D } from 'cc';
import { Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AstronautController')
export class AstronautController extends Component {
    @property(RigidBody2D) rigid: RigidBody2D;

    private force = new Vec2(-300, 1000);

    start() {
        this.jumpOut();
    }

    jumpOut(){
        this.rigid.applyForceToCenter(this.force, true);
        this.scheduleOnce(()=>{
            this.node.destroy();
        }, 2.5)
    }
    
}

