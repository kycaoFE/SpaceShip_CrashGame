import { Vec3, SpriteFrame } from 'cc';
import { tween } from 'cc';
import { Sprite } from 'cc';
import { Vec2 } from 'cc';
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('backgroundController')
export class backgroundController extends Component {

    @property(Node) spriteArray: Node[] = [];
    @property(Node) shipController: Node;
    @property positionMove: number = 0;


    private positionArray: Array<number> = [-1152, 0, 1152];
    private locationDeltaMouse: Vec2;
    private isMoving: boolean;
    private isTouch: boolean;
    private _shipController: any;
    private numShipCurrent: number;


    start() {
        this._shipController = this.shipController.getComponent('ShipController')
        this.locationDeltaMouse = new Vec2(0, 0);
        this.isMoving = false;
        this.isTouch = false;
        this.numShipCurrent = 1;

        this.node.on(Node.EventType.TOUCH_START, (event) => {
            this.isTouch = true;
        })
        this.node.on(Node.EventType.TOUCH_MOVE, (event) => {
            if (this._shipController.startRound) return;
            this.moveContainer(event);
        }, this);
        this.node.on(Node.EventType.TOUCH_END, (event) => {
            if (this.isTouch) {
                this.isMoving = false;
                this.isTouch = false;
            }
        }, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, (event) => {
            if (this.isTouch) {
                this.isMoving = false;
                this.isTouch = false;
            }
        }, this);
    }

    update(deltaTime: number) {
        if (this.node.position.x < 5 && this.node.position.x > -5) return;
        if (this.isTouch) {
            return
        };
        if (this.isMoving) return;
        this.checkInMid();
    }

    moveContainer(event) {
        this.locationDeltaMouse = event.getUIDelta();
        const newPosition = this.node.getPosition();
        this.node.setPosition(new Vec3(newPosition.x + this.locationDeltaMouse.x));
    }

    checkInMid() {
        if (this.node.position.x > 5) {
            this.isMoving = true;
            this.isTouch = true;
            this.getLeftShip()
        }
        if (this.node.position.x < -5) {
            this.isMoving = true;
            this.isTouch = true;
            this.getRightShip();
        }
        return false;
    }

    scaleShip(ship: Sprite, duration: number, scale: Vec3) {
        tween(ship.node)
            .to(duration, { scale: scale })
    }

    getRightShip(){
        tween(this.node)
                .to(0.5, { position: new Vec3(-1152, 0, 0) })
                .call(() => {
                    const backgroundTemp = this.spriteArray[0];
                    for (let i = 0; i < this.spriteArray.length; i++) {
                        console.warn(i, this.spriteArray[i]);
                        if (i == this.spriteArray.length - 1) {
                            this.spriteArray[i] = backgroundTemp;
                        }
                        else{
                            this.spriteArray[i] = this.spriteArray[i + 1];
                        }
                    }
                    for (let i = 0; i < this.spriteArray.length; i++) {
                        this.spriteArray[i].position = new Vec3(this.positionArray[i], this.spriteArray[i].position.y);
                    }
       
                    this.node.position = new Vec3(0, 0, 0);
                    return true;
                })
                .start()
    }

    getLeftShip(){
        tween(this.node)
                .to(0.5, { position: new Vec3(1152, 0, 0) })
                .call(() => {
                    const backgroundTemp = this.spriteArray[this.spriteArray.length - 1];
                    for (let i = this.spriteArray.length - 1; i >= 0; i--) {
                        if (i == 0) {
                            this.spriteArray[i] = backgroundTemp;
                        }
                        else{
                            this.spriteArray[i] = this.spriteArray[i - 1];
                        }
                    }
                    for (let i = 0; i < this.spriteArray.length; i++) {
                        this.spriteArray[i].position = new Vec3(this.positionArray[i], this.spriteArray[i].position.y);
                    }
                    this.node.position = new Vec3(0, 0, 0);
                    return true;
                })
                .start()
    }
}

