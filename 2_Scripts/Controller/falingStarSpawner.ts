import { instantiate } from 'cc';
import { Vec3 } from 'cc';
import { Prefab } from 'cc';
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('falingStarSpawner')
export class falingStarSpawner extends Component {

    @property(Prefab) fallingStar: Prefab;

    private timeSpawn: number;

    start() {
        this.timeSpawn = (Math.random()*5);
    }

    update(deltaTime: number) {
        if(this.timeSpawn <= 0){
            this.spawn();
            this.timeSpawn = (Math.random()*5);
        }
        this.timeSpawn -= deltaTime;
    }

    spawn(){
        const fallingStar = instantiate(this.fallingStar);
        fallingStar.parent = this.node;
        const backgroundPositionY = this.node.parent.position.y; 
        fallingStar.position = new Vec3((Math.random()*580) - 580, (Math.random()*640) - 640 - backgroundPositionY + 400);
    }
}

