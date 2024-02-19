import { _decorator, Component, Node, sys } from 'cc';
const { ccclass, property } = _decorator;

import globalNetwork from '../../../cc-common/cc-network/globalNetwork';
import { gaSocketManager } from '../../../cc-common/cc30-arcade-base/Scripts/Network/gaSocketManager';
import loadConfigAsync from '../../../cc-common/cc-share/shareServices/loadConfigAsync';
import gaBaseConfig from '../../../cc-common/cc30-arcade-base/Scripts/Config/gaBaseConfig';
import gaCommandID from '../../../cc-common/cc30-arcade-base/Scripts/Network/gaCommandID';
import gameCommonUtils from '../../../cc-common/cc-share/common/gameCommonUtils';

@ccclass('Network')
export class Network extends Component {
    private socketManager: gaSocketManager;

    public authenticate(){
        return new Promise((resolve: Function, reject: Function)=>{
            let token = this.getToken();
            if (token != undefined) {
                globalNetwork.init(token, 'iframe', '2995');
                this.createSocket();
                resolve();
            }
            else {
                reject();
            }
        });
    }
    
    public joiGame(){
        return new Promise((resolve: Function, reject: Function)=>{
            const { URL_CODE } = loadConfigAsync.getConfig();
            let code: any = null;
            let env = 2;
            

            if (gaBaseConfig.isIFrame) {
                code = gameCommonUtils.getUrlParam(URL_CODE);
                env = parseInt(gameCommonUtils.getUrlParam('env')) || 2;
            }else {
                env = sys.isBrowser ? 1 : 3;
            }

            const payload = {
                event: gaCommandID.R_JOIN_GAME,
                data: { code, env }
            };

            this.sendMessage(payload)
            .then(resolve())
            .catch(reject());
        })
    }

    cashOut(){
        const payload = {
            event: 'eg',
            data: {}
        };
        return this.sendMessage(payload)
    }

    startGame(bId: string, betValue: number, stopRatio: number) {
        //bet:autoStopRatio
        let cus = betValue+":"+stopRatio;    

        const payload = {
            event: 'ng',
            data: {bId, cus }
        };
        return this.sendMessage(payload)
    }

    keepPlayerActive(){
        const payload = {
            event: 'pa'
        }
        this.sendMessage(payload);
        console.log('keep');
    }

    getToken(): string {
        const TOKEN = loadConfigAsync.getConfig().TOKEN;
        let token = '';
        if (TOKEN) {
            token = TOKEN;
        }
        else {
            token = this.getUrlParam('token');
        }
        if (!token) {
            token = localStorage.getItem('USER_TOKEN');
        }
        return token;
    }

    getUrlParam(name: string): any {
        if (sys.isNative) return null;
        const url = new URL(window.location as any);
        return url.searchParams.get(name);
    }

    createSocket() {
        this.socketManager = new gaSocketManager('2995', ()=>{}, ()=>{});
        this.socketManager.checkReady();
    }

    sendMessage(payload: any){
        return new Promise((resolve: Function, reject: Function)=>{
            this.socketManager.sendMessage(payload)
            .then(resolve())
            .catch(reject());
        })
    }
}

