import { _decorator, Component, Label, Node, instantiate, Game } from 'cc';
const { ccclass, property } = _decorator;

import gaEventEmitter from '../../../cc-common/cc30-arcade-base/Scripts/Common/gaEventEmitter';
import EventCode from '../Common/EventCode';
import { Network } from '../Network/Network';
import { Data } from '../Common/Data';
import { AnimationClip } from 'cc';
import { Vec3 } from 'cc';
import gaEventsCode from '../../../cc-common/cc30-arcade-base/Scripts/Definitions/gaEventsCode';
const network = new Network();

@ccclass('MainController')
export class MainController extends Component {

    @property(Node) ui: Node = null;
    @property(Node) GameController: Node;
    @property(Node) Fire: Node;
    @property(Node) BackScene: Node;
    @property(Node) Ship: Node;

    private uiController: any;
    private isPlayerActive: boolean;
    private isStartGame: boolean;
    private timeActiveCurrent: number;
    private timeActive: number;
    private gameController: any;
    private backSceneController: any;
    private shipController: any;


    protected start() {
        this.ui.active = true;
        this.timeActive = 0.2;
        this.timeActiveCurrent = this.timeActive;
        this.uiController = this.ui.getComponent('UIController');
        this.gameController = this.GameController.getComponent('GameController');
        this.backSceneController = this.BackScene.getComponent('BackSceneController');
        this.shipController = this.Ship.getComponent('ShipController');
        this.login();

        gaEventEmitter.instance.registerEvent(EventCode.SERVER.WEB_SOCKET_OPEN, this.joinGame.bind(this));
        gaEventEmitter.instance.registerEvent(EventCode.RESPONSE.CLAIM_GAME, this.claimGame.bind(this));
        gaEventEmitter.instance.registerEvent(EventCode.RESPONSE.FIRED_EVENT, this.firedEvent.bind(this));
        gaEventEmitter.instance.registerEvent(EventCode.RESPONSE.JOIN_GAME_RESULT,this.checkStateGame.bind(this));
        gaEventEmitter.instance.registerEvent(gaEventsCode.NETWORK.CANNOT_AUTHEN, this.cantNotAuthen.bind(this));
        gaEventEmitter.instance.registerEvent(gaEventsCode.NETWORK.WEB_SOCKET_TEMP_DISCONNECT, this.disconnectToNetwork.bind(this));
        // gaEventEmitter.instance.registerEvent(EventCode.REQUEST.UPDATE_WALLET, this.updateWallet.bind(this));
    }

    protected update(dt: number): void {
        if (this.timeActiveCurrent <= 0) {
            network.keepPlayerActive();
            this.timeActiveCurrent = this.timeActive;
        }
        if (this.isPlayerActive) {
            this.timeActiveCurrent -= dt;
        }
        else if (!this.isPlayerActive) {
            this.timeActiveCurrent = this.timeActive;
            return;
        }
    }

    private login() {
        network.authenticate()
            .then(() => {

            })
            .catch(() => {
                this.uiController.openPopup('Đăng nhập thất bại', 0);
            })
    }

    private joinGame() {
        this.uiController.openPopup('Đăng nhập thành công', 1);
        network.joiGame()
            .then(() => {
                // this.uiController.openPopup('Join game thành công', 1);
                this.updateWallet();
            })
            .catch(() => {
                this.uiController.openPopup('Join game thất bại', 0);
            })
    }

    public startGame() {
        Data.instance.muL = 0.0;
        const betValue = Data.instance.betValue;
        const stopRatioValue = Data.instance.ratioValue;
        network.startGame('10', betValue, stopRatioValue);
        this.uiController.startGame();
        this.isPlayerActive = true;
    }

    public cashOut() {
        network.cashOut();
        // this.backSceneController.isFly = false;
    }

    public firedEvent() {
        // this.backSceneController.isFly = false;
        this.restartRound();
        this.uiController.firedEvent();
        this.gameController.isStartGame = false;
        this.isPlayerActive = false;
    }

    public claimGame() {
        // this.backSceneController.isFly = false;
        this.gameController.isStartGame = false;
        this.restartRound();
        this.isPlayerActive = false;
        this.uiController.claimGame();
    }

    restartRound(){
        this.scheduleOnce(()=>{
            network.joiGame().then(()=>{
                this.updateWallet();
            });
            gaEventEmitter.instance.emit(EventCode.STATE.PREPARING);
            // this.Ship.position = new Vec3(0,-250,0);
            this.backSceneController.isFly = false;
            this.Ship.active = false;
        },3);
    }

    checkStateGame(data){
        if(!data.player){
            Data.instance.modeGame = 'ng';
            this.uiController.setModeButton('NORMAL');
        }
        else{
            if(data.player.fg >= 0) {
                Data.instance.modeGame = 'fg';
                this.uiController.setModeButton('FREE: '+ data.player.fg);
            }
            else{
                Data.instance.modeGame = 'ng';
                this.uiController.setModeButton('NORMAL');
            }
        }
        this.backSceneController.restartRound();
        this.Ship.active = true;
        this.Ship.position = new Vec3(0, -230, 0);
        // this.uiController.setMuL('0.0');
        this.uiController.preparing();
    }

    public updateWallet(){
        const wallet = network.updateWallet();
        gaEventEmitter.instance.emit(EventCode.REQUEST.UPDATE_WALLET, wallet.amount);
    }

    cantNotAuthen(){
        this.uiController.openPopup('Đăng nhập thất bại', 0);
    }

    disconnectToNetwork(){
        this.uiController.openPopup('Mất kết nối...', 0);
    }
}

