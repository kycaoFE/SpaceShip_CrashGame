import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

import gaEventEmitter from '../../../cc-common/cc30-arcade-base/Scripts/Common/gaEventEmitter';

@ccclass('GameController')
export class GameController extends Component {

    @property(Node) MainControllerNode: Node;
    @property(Node) UINode: Node;

    private mainController: any;
    private uiController: any;
    public isStartGame: boolean;

    start() {
        this.mainController = this.MainControllerNode.getComponent('MainController');
        this.uiController  = this.UINode.getComponent('UIController');
        this.isStartGame = false;
    }

    update(deltaTime: number) {

    }

    clickStart(){
        if(!this.isStartGame){
            this.normalGame();
        }
        else{
            this.cashOut();
        }
    }

    normalGame(){
        this.mainController.startGame();
    }

    cashOut(){
        this.mainController.cashOut();
    }
}

