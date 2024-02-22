import { Vec3 } from 'cc';
import { tween } from 'cc';
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

import gaEventEmitter from '../../../cc-common/cc30-arcade-base/Scripts/Common/gaEventEmitter';
import EventCode from '../Common/EventCode';
import { Animation } from 'cc';
import { SpriteFrame } from 'cc';
import { Sprite } from 'cc';
import { TWO_PI } from 'cc';
import { Data } from '../Common/Data';


@ccclass('ShipController')
export class ShipController extends Component {

    @property(Node) fire: Node;
    @property(Animation) fireAnimation: Animation;
    @property([Animation]) smokeAnimation: Animation[] = [];
    @property(Sprite) shipSprite: Sprite;
    @property(Animation) shipAnimation: Animation;
    @property(SpriteFrame) shipIdle: SpriteFrame;
    @property(Node) astronaut: Node;

    private shipSpeed: number;
    public isFly: boolean;
    public isFastFly: boolean;

    protected start(): void {
        this.smokeAnimation.forEach(element => {
            element.node.active = false;
        });
        this.isFastFly = false;
        const explosion = this.firedEvent.bind(this);
        gaEventEmitter.instance.registerEvent(EventCode.RESPONSE.FIRED_EVENT, explosion);
        gaEventEmitter.instance.registerEvent(EventCode.RESPONSE.CLAIM_GAME, this.winGame.bind(this));
        gaEventEmitter.instance.registerEvent(EventCode.RESPONSE.NORMAL_GAME, this.startGame.bind(this));
        gaEventEmitter.instance.registerEvent(EventCode.RESPONSE.FREE_GAME, this.startGame.bind(this));
        gaEventEmitter.instance.registerEvent(EventCode.STATE.PREPARING, this.idle.bind(this));
    }

    protected update(dt: number): void {
        if(this.isFly) {
            this.shipAnimation.getState('fly').speed = Data.instance.muL/10;
        }
        if(!this.isFastFly && this.node.position.y >= 0){
            this.fly();
            this.isFastFly = true;
        }
    }
    
    startGame(){
        this.beginFly();
        // tween(this.node)
        // .to(0.78, {position: new Vec3(0,0,0)})
        // .call(()=>{
        //     this.fly();
        // })
        // .start();
    }

    winGame(){
        this.astronaut.active = true;
        this.astronaut.position = this.node.position;
        gaEventEmitter.instance.emit(EventCode.STATE.WIN);
        this.fly();
        tween(this.node)
            .by(2, {position: new Vec3(0,1000,0)})
            .call(()=>{
                this.node.position = new Vec3(0,-250,0);
                console.warn('reset');
            })
            .start();
    }

    idle(){
        this.isFly = false;
        this.fire.active = false;
        this.shipAnimation.stop();
        this.shipSprite.node.active = true;
        this.shipSprite.spriteFrame = this.shipIdle;
        console.warn('prepare');
    }

    fly(){
        this.isFly = true;
        this.shipAnimation.play('fly');
        this.fire.active = true;
        this.smokeAnimation.forEach(element => {
            element.node.active = false;
        });
    }

    beginFly(){
        this.isFastFly = false;
        this.shipAnimation.play('fly');
        this.smokeAnimation.forEach(element => {
            element.node.active = true;
            element.play();
        });
        this.fire.active = true;
        this.fireAnimation.play('small_fire');
        this.scheduleOnce(()=>{
            this.smokeAnimation.forEach(element => {
                element.node.active = false;
            });
            this.fireAnimation.play('ship_fire');
        }, 0.78)
    }

    firedEvent(){
        this.shipAnimation.play('explosion');
        this.fire.active = false;
    }
}

