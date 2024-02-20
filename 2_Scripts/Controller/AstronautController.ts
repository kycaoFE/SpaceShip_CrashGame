import { Vec3 } from 'cc';
import { tween } from 'cc';
import { _decorator, Component, Node } from 'cc';
import gaEventEmitter from '../../../cc-common/cc30-arcade-base/Scripts/Common/gaEventEmitter';
import EventCode from '../Common/EventCode';
const { ccclass, property } = _decorator;

@ccclass('AstronautController')
export class AstronautController extends Component {


    @property
    gravity: number = -9.8; // Gravitational acceleration

    @property
    initialVelocity: number = 5; // Initial velocity when bouncing

    @property
    bounceHeight: number = 5; // Height to which object bounces

    private isBouncing: boolean = false;
    private initialPosition: Vec3 = new Vec3();
    private currentVelocity: number = 0;

    start() {
        gaEventEmitter.instance.registerEvent(EventCode.STATE.WIN, this.jumpOut.bind(this));
        this.initialPosition = this.node.position.clone();
    }

    update(deltaTime: number) {
        if (!this.isBouncing) {
            return;
        }

        // Calculate displacement using basic physics equations
        const displacement = this.currentVelocity * deltaTime + 0.5 * this.gravity * deltaTime * deltaTime;
        const newPositionY = this.node.position.y + displacement;
        
        // Check if the object has reached the ground
        if (newPositionY <= this.initialPosition.y) {
            this.node.setPosition(this.initialPosition);
            this.isBouncing = false;
            return;
        }

        this.node.setPosition(new Vec3(this.node.position.x, newPositionY, this.node.position.z));

        // Update velocity
        this.currentVelocity += this.gravity * deltaTime;
    }

    public startBounce() {
        if (!this.isBouncing) {
            this.isBouncing = true;
            this.currentVelocity = this.initialVelocity;
        }
    }

    jumpOut(){
        // tween(this.node)
        // .by(1, {position: new Vec3(100, 150, 0)})
        // .by(1, {position: new Vec3(100, -500, 0)})
        // .call(()=>{
        //     this.node.active = false;
        // })
        // .start();
        this.startBounce();
    }
}

