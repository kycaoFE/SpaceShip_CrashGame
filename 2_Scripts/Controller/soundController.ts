import { AudioSource } from 'cc';
import { AudioClip } from 'cc';
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('soundController')
export class soundController extends Component {

    @property(AudioClip) listSoundAsset: AudioClip[] = [];

    private audioSource: AudioSource;
    private soundMap: Record<string, AudioClip> = {};
    private volume: number = 1;

    start() {
        this.audioSource = this.node.getComponent(AudioSource);
        this.listSoundAsset.forEach(sound => {
            this.soundMap[sound.name] = sound;
        });
    }

    update(deltaTime: number) {
        
    }

    playSound(name: string, volume: number, loop: boolean){
        this.audioSource.clip = this.soundMap[name]
    }
}

