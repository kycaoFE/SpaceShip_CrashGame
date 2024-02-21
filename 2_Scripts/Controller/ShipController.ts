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

    @property(Node) Fire: Node;
    @property(Animation) FireAnimation: Animation;
    @property(Animation) SmokeAnimation: Animation;
    @property(Sprite) ShipSprite: Sprite;
    @property(Animation) ShipAnimation: Animation;
    @property(SpriteFrame) ShipIdle: SpriteFrame;
    @property(Node) Astronaut: Node;

    private shipSpeed: number;
    public isFly: boolean;
    public isFastFly: boolean;

    protected start(): void {
        this.SmokeAnimation.node.active = false;
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
            this.ShipAnimation.getState('fly').speed = 1/Data.instance.muL;
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
        this.Astronaut.active = true;
        this.Astronaut.position = this.node.position;
        gaEventEmitter.instance.emit(EventCode.STATE.WIN);
        this.fly();
        tween(this.node)
            .by(2, {position: new Vec3(0,1000,0)})
            .call(()=>{
                this.node.position = new Vec3(0,-230,0);
                console.warn('reset');
            })
            .start();
    }

    idle(){
        this.isFly = false;
        this.Fire.active = false;
        this.ShipAnimation.stop();
        this.ShipSprite.node.active = true;
        this.ShipSprite.spriteFrame = this.ShipIdle;
        console.warn('prepare');
    }

    fly(){
        this.isFly = true;
        this.ShipAnimation.play('fly');
        this.Fire.active = true;
        this.SmokeAnimation.node.active = false;
    }

    beginFly(){
        this.isFastFly = false;
        this.ShipAnimation.play('fly');
        this.SmokeAnimation.node.active = true;
        this.SmokeAnimation.play();
        this.Fire.active = true;
        this.FireAnimation.play('small_fire');
        this.scheduleOnce(()=>{
            this.SmokeAnimation.node.active = false;
            this.FireAnimation.play('ship_fire');
        }, 0.78)
    }

    firedEvent(){
        this.ShipAnimation.play('explosion');
        this.Fire.active = false;
    }
}

