import { _decorator, Component, Label, Node, instantiate, Game } from 'cc';
const { ccclass, property } = _decorator;

import gaEventEmitter from '../../../cc-common/cc30-arcade-base/Scripts/Common/gaEventEmitter';
import EventCode from '../Common/EventCode';
import { Network } from '../Network/Network';
import { Data } from '../Common/Data';
const network = new Network();

@ccclass('MainController')
export class MainController extends Component {

    @property(Node) ui: Node = null;
    @property(Node) GameController: Node;


    private uiController: any;
    private isPlayerActive: boolean;
    private isStartGame: boolean;
    private timeActiveCurrent: number;
    private timeActive: number;
    private gameController: any;
    

    protected start() {
        this.timeActive = 0.2;
        this.timeActiveCurrent = this.timeActive;
        this.uiController = this.ui.getComponent('UIController');
        this.gameController = this.GameController.getComponent('GameController');
        this.login();

        gaEventEmitter.instance.registerEvent(EventCode.RESPONSE.CLAIM_GAME, this.claimGame);
        gaEventEmitter.instance.registerEvent(EventCode.SERVER.WEB_SOCKET_OPEN, this.joinGame.bind(this));

    }

    protected update(dt: number): void {
        if(this.timeActiveCurrent <= 0 ) {
            network.keepPlayerActive();
            this.timeActiveCurrent = this.timeActive;
        }
        if(this.isPlayerActive){
            this.timeActiveCurrent -= dt;
        }
        else if(!this.isPlayerActive) {
            this.timeActiveCurrent = this.timeActive;
            return;
        }
    }

    private login() {
        network.login()
            .then(()=>{
                this.uiController.openPopup('Đăng nhập thành công', 2);
            })
            .catch(()=>{
                this.uiController.openPopup('Đăng nhập thất bại', 2);
            })
    }

    private joinGame() {
            network.joiGame()
            .then(()=>{
                this.uiController.openPopup('Join game thành công', 2);
            })
            .catch(()=>{
                this.uiController.openPopup('Join game thất bại', 2);
            })
    }

    public startGame() {
        const betValue = Data.instance.betValue;
        const stopRatioValue = Data.instance.ratioValue;
        network.startGame('10', betValue, stopRatioValue);
        this.uiController.startGame();
        this.isPlayerActive = true;
        this.gameController.isStartGame = true;
    }

    public cashOut(){
        network.cashOut();
    }

    public firedEvent(){
        this.uiController.firedEvent();
        this.gameController.isStartGame = false;
        this.isPlayerActive = false;
    }

    public claimGame(){
        this.isPlayerActive = false;
        this.uiController.claimGame();
        this.gameController.isStartGame = false;
    }
}

