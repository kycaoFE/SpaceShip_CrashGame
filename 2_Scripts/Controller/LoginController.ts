import { _decorator, Component, Node, director, ProgressBar } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LoginController')
export class LoginController extends Component {

    @property(ProgressBar) loadingBar: ProgressBar = null;
    @property(Node) loadingController: Node = null;
    @property(Node) mainScene: Node = null;

    
    start() {
        this.loadingBar.progress = 0;
        this.preloadMainScene();
    }

    preloadMainScene() {
        this.loadingBar.node.active = true;
        director.preloadScene("MainScene", (completedCount, totalCount) => {
            if(totalCount > 100) {
                var progress = (completedCount / totalCount);
                this.loadingBar.progress = progress;
            }
            else{
                var progress = (completedCount /140);
                this.loadingBar.progress = progress;
            }  
        }, (error) => {
            if (!error) {
                this.loadMainScreen();
            } else {
                console.error(error);
            }
        });
    }

    loadMainScreen() {
        director.addPersistRootNode(this.node);
        director.loadScene("MainScene", (err, scene) => {
            director.removePersistRootNode(this.node);
            if (err) return;
            const canvas: Node = scene.getChildByName('Canvas');
            const mainRoot: Node = canvas.getChildByName('root');
            mainRoot.setParent(this.mainScene);
            this.loadingController.active = false;
            this.loadingController.destroy();
            canvas.destroy();
        });
    }
}

