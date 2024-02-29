import { Animation } from 'cc';
import { Vec3 } from 'cc';
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('falingStarController')
export class falingStarController extends Component {
    @property(Animation) ani: Animation; 

    start() {
        this.ani = this.node.getComponent(Animation);

        this.ani.defaultClip.speed = (Math.random()*0.3) + 0.1;
        this.node.scale = new Vec3((Math.random()*(2+2)) - 2, (Math.random()*5) + 0)
        this.scheduleOnce(()=>{
            this.node.destroy();
        },1.5)

    }

    update(deltaTime: number) {
        
    }
}

