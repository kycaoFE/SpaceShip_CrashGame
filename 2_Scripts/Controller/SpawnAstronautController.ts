import { Prefab } from 'cc';
import { _decorator, Component, Node } from 'cc';
import gaEventEmitter from '../../../cc-common/cc30-arcade-base/Scripts/Common/gaEventEmitter';
import EventCode from '../Common/EventCode';
import { instantiate } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SpawnAstronautController')
export class SpawnAstronautController extends Component {

    @property(Prefab) astronaut: Prefab;
    @property(Node) ship: Node;

    start() {
        gaEventEmitter.instance.registerEvent(EventCode.RESPONSE.CLAIM_GAME, this.spawn.bind(this));
    }

    spawn(){
        this.node.position = this.ship.position;
        const _astronaut = instantiate(this.astronaut);
        _astronaut.parent = this.node;
    }
}

