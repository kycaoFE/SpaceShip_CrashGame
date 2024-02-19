import { Sprite } from 'cc';
import { randomRange } from 'cc';
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

import { SpriteAtlas } from 'cc';

@ccclass('StarController')
export class StarController extends Component {

    @property(SpriteAtlas) StartAtlas: SpriteAtlas;

    start() {
        const nameStar = 'Starry background  - Layer 02 - Stars_' + Math.floor((Math.random() * 89) + 11);
        this.node.getComponent(Sprite).spriteFrame = this.StartAtlas.getSpriteFrame(nameStar);
    }

    update(deltaTime: number) {
        
    }
}

