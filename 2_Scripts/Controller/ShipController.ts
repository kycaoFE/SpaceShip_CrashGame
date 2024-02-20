import { Vec3 } from 'cc';
import { tween } from 'cc';
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

import gaEventEmitter from '../../../cc-common/cc30-arcade-base/Scripts/Common/gaEventEmitter';
import EventCode from '../Common/EventCode';
import { Animation } from 'cc';
import { SpriteFrame } from 'cc';
import { Sprite } from 'cc';


@ccclass('ShipController')
export class ShipController extends Component {

    @property(Node) Fire: Node;
    @property(Sprite) ShipSprite: Sprite;
    @property(Animation) ShipAnimation: Animation;
    @property(SpriteFrame) ShipIdle: SpriteFrame;

    private shipSpeed: number;
    public isFly: boolean;

    protected start(): void {
        const explosion = this.firedEvent.bind(this);
        gaEventEmitter.instance.registerEvent(EventCode.RESPONSE.FIRED_EVENT, explosion);
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

    fly(){
        this.ShipAnimation.play('fly');
    }

    idle(){
        this.ShipSprite.node.active = true;
        this.ShipSprite.spriteFrame = this.ShipIdle;
        console.warn('prepare');
    }
}

