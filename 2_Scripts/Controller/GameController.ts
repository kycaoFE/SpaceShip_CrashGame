import { _decorator, Component, Node, instantiate } from 'cc';
const { ccclass, property } = _decorator;

import gaEventEmitter from '../../../cc-common/cc30-arcade-base/Scripts/Common/gaEventEmitter';
import { Data } from '../Common/Data';
import EventCode from '../Common/EventCode';

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

        gaEventEmitter.instance.registerEvent(EventCode.RESPONSE.PLAYER_INFO_UPDATE, this.updateMuL.bind(this));
    }

    update(deltaTime: number) {

    }

    setDefault(){
        
    }

    clickStart(){
        if(!this.isStartGame){
            this.normalGame();
            this.isStartGame = true;
        }
        else{
            this.cashOut();
            this.isStartGame = false
        }
    }

    normalGame(){
        this.mainController.startGame();
    }

    cashOut(){
        this.mainController.cashOut();
    }

    updateMuL(data){
        Data.instance.muL = data.player.mul;
        this.uiController.setMuL(data.player.mul);
    }
}

