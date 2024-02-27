import { Vec3 } from 'cc';
import { tween } from 'cc';
import { Sprite } from 'cc';
import { Vec2 } from 'cc';
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('containerShipController')
export class containerShipController extends Component {

    @property(Sprite) shipLeft: Sprite;
    @property(Sprite) shipMid: Sprite;
    @property(Sprite) shipRight: Sprite;
    @property(Sprite) spriteArray: Sprite[] = [];
    @property(Node) shipController: Node;



    private locationDeltaMouse: Vec2;
    private isMoving: boolean;
    private _shipController: any;


    start() {
        this._shipController = this.shipController.getComponent('ShipController')
        this.locationDeltaMouse = new Vec2(0,0);
        this.isMoving = false;
        this.spriteArray.push(this.shipLeft);
        this.spriteArray.push(this.shipMid);
        this.spriteArray.push(this.shipRight);

        this._shipController.setShipIdle(this.shipMid.spriteFrame);
        this.node.on(Node.EventType.TOUCH_MOVE, (event) => {
            if(this._shipController.startRound) return;
            this.isMoving = true;
            this.moveContainer(event);
        }, this);
        this.node.on(Node.EventType.TOUCH_END, (event) => {
            this.isMoving = false;
            // this.checkInMid();
        }, this);

        this.node.on(Node.EventType.TOUCH_CANCEL, (event) => {
            this.isMoving = false;
            // this.checkInMid();
        }, this);
    }

    update(deltaTime: number) {

        if(this.isMoving) {
            this.spriteArray.forEach(element => {
                const scaleX = 1.5-(Math.abs((this.node.position.x+ element.node.position.x)*2/1000))
                element.node.scale = new Vec3(scaleX, scaleX, scaleX)
            });
            return
        };
        this.checkInMid();
    }

    moveContainer(event){
        this.locationDeltaMouse = event.getUIDelta();
        console.log(this.locationDeltaMouse);
        const newPosition = this.node.getPosition(); 
        this.node.setPosition(new Vec3(newPosition.x + this.locationDeltaMouse.x));
    }

    checkInMid(){
        if(this.node.position.x > 0){
            this.isMoving = true;
            tween(this.node)
            .to(0.5, {position: new Vec3(600,0,0)})
            .call(()=>{
                const tempSprite = this.shipRight.spriteFrame;
                this.shipRight.spriteFrame = this.shipMid.spriteFrame;
                this.shipMid.spriteFrame = this.shipLeft.spriteFrame;
                this.shipLeft.spriteFrame = tempSprite;
                this.node.position = new Vec3(0,0,0);
                this.shipMid.node.scale = new Vec3(1.5, 1.5, 1.5);
                this.isMoving = false;
                this._shipController.setShipIdle(this.shipMid.spriteFrame);
                return true;
            })
            .start()
        }
        if(this.node.position.x < 0){
            this.isMoving = true;
            tween(this.node)
            .to(0.5, {position: new Vec3(-600,0,0)})
            .call(()=>{
                const tempSprite = this.shipLeft.spriteFrame;
                this.shipLeft.spriteFrame = this.shipMid.spriteFrame;
                this.shipMid.spriteFrame = this.shipRight.spriteFrame;
                this.shipRight.spriteFrame = tempSprite;
                this.node.position = new Vec3(0,0,0);
                this.shipMid.node.scale = new Vec3(1.5, 1.5, 1.5);
                this.isMoving = false;
                this._shipController.setShipIdle(this.shipMid.spriteFrame);
                return true;
            })
            .start()
        }
        return false;
    }

    scaleShip(ship: Sprite, duration: number, scale: Vec3){
        tween(ship.node)
        .to(duration, {scale: scale})
    }
}

