import { Vec3, SpriteFrame } from 'cc';
import { tween } from 'cc';
import { Button } from 'cc';
import { Sprite } from 'cc';
import { Vec2 } from 'cc';
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('containerShipController')
export class containerShipController extends Component {

    @property(Sprite) spriteArray: Sprite[] = [];
    @property(Node) shipController: Node;
    @property(Button) scrollButton: Button[] = []

    @property positionMove: number = 0;



    private locationDeltaMouse: Vec2;
    private isMoving: boolean;
    private isTouch: boolean;
    private isScrolling: boolean;
    private _shipController: any;
    private numShipCurrent: number;
    private timeMinChange: number;


    start() {
        this._shipController = this.shipController.getComponent('ShipController')
        this.locationDeltaMouse = new Vec2(0, 0);
        this.isMoving = false;
        this.isTouch = false;
        this.isScrolling = false;
        this.numShipCurrent = 1;
        this.timeMinChange = 1;

        this._shipController.setShipIdle(this.spriteArray[1].spriteFrame);
        this.node.on(Node.EventType.TOUCH_START, (event) => {
            this.isTouch = true;
        })
        this.node.on(Node.EventType.TOUCH_MOVE, (event) => {
            if (this._shipController.startRound ) return;
            this.scrollButton.forEach(button => {
                button.node.active = false
            });
            this.moveContainer(event);
        }, this);
        this.node.on(Node.EventType.TOUCH_END, (event) => {
            if (this.isTouch ) {
                this.isMoving = false;
                this.isTouch = false;
            }
        }, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, (event) => {
            if (this.isTouch ) {
                this.isMoving = false;
                this.isTouch = false;
            }
        }, this);
    }

    update(deltaTime: number) {
        if (this.node.position.x < 5 && this.node.position.x > -5) return;
        if (this.isTouch) {
            this.spriteArray.forEach(sprite => {
                this.scaleShip(sprite.node, 1.5)
            });
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
        console.log('check');
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

    scaleShip(target: Node, scaleTarget: number) {
            const scaleX = scaleTarget - (Math.abs((this.node.position.x + target.position.x) * 2 / 1000))
            target.scale = new Vec3(scaleX, scaleX, scaleX)
    }


    getRightShip(){
        if(this.isScrolling) return;
        this.isScrolling = true;
        tween(this.node)
                .to(0.5, { position: new Vec3(-this.positionMove, 0, 0) })
                .call(() => {
                    const tempSprite = this.spriteArray[0].spriteFrame;
                    for (let i = 0; i < this.spriteArray.length; i++) {
                        if (i < this.spriteArray.length - 1) {
                            this.spriteArray[i].spriteFrame = this.spriteArray[i + 1].spriteFrame;
                        }
                        else {
                            this.spriteArray[i].spriteFrame = tempSprite;
                        }
                    }
                    this.node.position = new Vec3(0, 0, 0);
                    this.spriteArray[1].node.scale = new Vec3(1.5, 1.5, 1.5);
                    this._shipController.setShipIdle(this.spriteArray[1].spriteFrame);
                    this.isScrolling = false;
                    this.scrollButton.forEach(button => {
                        button.node.active = true
                    });
                    return true;
                })
                .start()
    }

    getLeftShip(){
        if(this.isScrolling) return;
        this.isScrolling = true;
        tween(this.node)
                .to(0.5, { position: new Vec3(this.positionMove, 0, 0) })
                .call(() => {
                    const tempSprite = this.spriteArray[this.spriteArray.length - 1].spriteFrame;
                    for (let i = this.spriteArray.length - 1; i >= 0; i--) {
                        if (i > 0) {
                            this.spriteArray[i].spriteFrame = this.spriteArray[i - 1].spriteFrame;
                        }
                        else {
                            this.spriteArray[i].spriteFrame = tempSprite;
                        }
                    }
                    this.node.position = new Vec3(0, 0, 0);
                    this.spriteArray[1].node.scale = new Vec3(1.5, 1.5, 1.5);
                    this._shipController.setShipIdle(this.spriteArray[1].spriteFrame);
                    this.isScrolling = false;
                    this.scrollButton.forEach(button => {
                        button.node.active = true
                    });
                    return true;
                })
                .start()
    }
}

