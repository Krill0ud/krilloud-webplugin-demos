import * as PIXI from "pixi.js";
import Loader from "./Loader";
import Background from "./Background";
import DrumsButtons from "./DrumsButtons";
import Notes from "./Notes";
import StartModal from "./StartModal";

declare var krilloudSDK: any;

export default class Game {
    public app: PIXI.Application;
    private drumBtns: DrumsButtons;
    public firstPlayCalled: boolean;
    private krillLoaded: boolean;
    private gameLoaded: boolean;
    private loader: Loader;
    private time: Date;
    private notes: Notes;
    private startModal: StartModal;

    constructor() {
        this.krillLoaded = false;
        this.gameLoaded = false;
        this.app = new PIXI.Application({ width: 536, height: 920 });
        window.document.body.appendChild(this.app.view);
        this.loader = new Loader(this.app, this.krilloud_start.bind(this));
        this.firstPlayCalled = false;
        window.addEventListener("click", async () => {
        });
    }

    private checkLoaded() {
        if (this.krillLoaded && this.gameLoaded) {
            let loadingScreen = this.loader.getLoadingScreen();
            this.app.stage.removeChild(loadingScreen);
        }
    }

    private async init() {
        this.createScene();
        this.start();
        this.gameLoaded = true;
        this.checkLoaded();
    }

    private async krilloud_start() {
        let contractPath = "public/";
        let soundBankPath = "public/";
        await krilloudSDK.start(contractPath, soundBankPath);

        // Carga de tags
        var tagsToLoad = [
            { names: "Drums", objectId: 0 },    
            { names: "Music", objectId: 1 },    
            { names: "Fail", objectId: 2 }, 
        ];

        await krilloudSDK.load(tagsToLoad);
        this.krillLoaded = true;
        this.checkLoaded();
        this.init();
    }

    private createScene() {
        const bg = new Background(this.app.loader);
        this.app.stage.addChild(bg.sprite);
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private async startGame(){
        this.notes = new Notes(this.app, function(){});
        krilloudSDK.setVar("music_drums", 1, 1);
        krilloudSDK.setVar("music_no_drums", 1, 0);
        await this.delay(470); // 1000 ms de retraso
        
        krilloudSDK.play("Music", 1);
    }

    private start(){
        this.startModal = new StartModal(this.app, this.startGame.bind(this));
    }
}
