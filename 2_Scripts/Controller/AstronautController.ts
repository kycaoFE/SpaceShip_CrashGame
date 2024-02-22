import { Vec3 } from 'cc';
import { tween } from 'cc';
import { _decorator, Component, Node } from 'cc';
import gaEventEmitter from '../../../cc-common/cc30-arcade-base/Scripts/Common/gaEventEmitter';
import EventCode from '../Common/EventCode';
import { Vec2 } from 'cc';
import { RigidBody2D } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AstronautController')
export class AstronautController extends Component {
    @property(RigidBody2D) rigid: RigidBody2D;
    @property(Node) body: Node;

    private isJump: boolean;
    private force = new Vec2(500, 500);

    start() {
        this.rigid.gravityScale = 0;
        this.body.active = false;
        gaEventEmitter.instance.registerEvent(EventCode.RESPONSE.CLAIM_GAME, this.jumpOut.bind(this));
        // gaEventEmitter.instance.registerEvent(EventCode.RESPONSE.CLAIM_GAME, ()=>{
        //     this.isJump = true;
        //     this.scheduleOnce(()=>{
        //         this.isJump = true;
        //     }, 2)
        // });
        // this.node.active = false;
    }

    // jumpOut(){
    //     tween(this.node)
    //     .by(2, {position: new Vec3(-250, 300, 0)}, {
    //         easing: 'bounceIn',
    //     })
    //     .call(()=>{
    //         this.node.active = false;
    //     })
    //     .start();
    // }

    // protected update(dt: number): void {
    //     if(this.isJump) {
    //         this.jumpOut(dt);
    //     }
    // }

    jumpOut(){
        this.body.active = true;
        this.rigid.gravityScale = 1;
        this.rigid.applyForceToCenter(this.force, true);
    }
}

