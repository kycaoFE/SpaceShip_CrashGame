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


@ccclass('ShipController')
export class ShipController extends Component {

    @property(Node) Fire: Node;
    @property(Sprite) ShipSprite: Sprite;
    @property(Animation) ShipAnimation: Animation;
    @property(SpriteFrame) ShipIdle: SpriteFrame;
    @property(Node) Astronaut: Node;

    private shipSpeed: number;
    public isFly: boolean;

    protected start(): void {
        const explosion = this.firedEvent.bind(this);
        gaEventEmitter.instance.registerEvent(EventCode.RESPONSE.FIRED_EVENT, explosion);
        gaEventEmitter.instance.registerEvent(EventCode.RESPONSE.CLAIM_GAME, this.winGame.bind(this));
        gaEventEmitter.instance.registerEvent(EventCode.RESPONSE.NORMAL_GAME, this.fly.bind(this));
        gaEventEmitter.instance.registerEvent(EventCode.STATE.PREPARING, this.idle.bind(this));
    }
    
    startGame(){
        tween(this.node)
        .to(1, {position: new Vec3(0,0,0)})
        .start();
    }

    firedEvent(){
        this.ShipAnimation.play('explosion');
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

    fly(){
        this.ShipAnimation.play('fly');
    }

    idle(){
        this.ShipAnimation.stop();
        this.ShipSprite.node.active = true;
        this.ShipSprite.spriteFrame = this.ShipIdle;
        console.warn('prepare');
    }
}

