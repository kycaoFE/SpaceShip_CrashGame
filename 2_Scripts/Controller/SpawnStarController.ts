import { SpriteAtlas, instantiate } from 'cc';
import { Vec3 } from 'cc';
import { Prefab } from 'cc';
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SpawnStarController')
export class SpawnStarController extends Component {

    @property(Prefab) StarPrefab: Prefab;

    private numSpawn: number = 100;
   
    start() {

    }

    update(deltaTime: number) {
        if(this.numSpawn <= 0) return;
        this.spawnStar();
        this.numSpawn--;
    }

    spawnStar(){
        const star = instantiate(this.StarPrefab);
        star.parent = this.node;
        star.position = new Vec3(Math.floor(Math.random() * (500 + 500 + 1)) - 500, Math.floor(Math.random() * (10000 + 700 + 1)) - 700, 0);
    }
}

