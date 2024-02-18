import { _decorator, Component, Node, director } from 'cc';
const { ccclass } = _decorator;
import gaEventEmitter from '../../../cc-common/cc30-arcade-base/Scripts/Common/gaEventEmitter';
import gaCommandID from '../../../cc-common/cc30-arcade-base/Scripts/Network/gaCommandID';
import { Data } from './Data';


@ccclass('GeneralInitialization')
export class GeneralInitialization extends Component {
    protected onLoad(): void {
        this.baseInitInstances();
        director.addPersistRootNode(this.node);
    }

    private baseInitInstances(){
        if (gaEventEmitter.instance == null) {
            gaEventEmitter.instance = new gaEventEmitter();
        }
        if (gaCommandID.instance == null) {
            gaCommandID.instance = new gaCommandID();
        }
        if(Data.instance == null) {
            Data.instance = new Data();
        }

    }
}

