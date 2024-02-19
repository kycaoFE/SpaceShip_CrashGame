import { Vec3 } from 'cc';
import { tween } from 'cc';
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;


@ccclass('ShipController')
export class ShipController extends Component {

    @property(Node) Fire: Node;
    @property(Animation) FireAnimation: Animation;

    private shipSpeed: number;
    public isFly: boolean;
    
    startGame(){
        tween(this.node)
        .to(1, {position: new Vec3(0,0,0)})
        .start();
    }
}

