import * as PIXI from "pixi.js";
import Loader from "./Loader";
import PlayButton from "./PlayButton";
import Background from "./Background";
import ReelsContainer from "./ReelsContainer";
import Scoreboard from "./Scoreboard";
import VictoryScreen from "./VictoryScreen";

declare var krilloudSDK: any;

export default class Game {
    public app: PIXI.Application;
    private playBtn: PlayButton;
    private reelsContainer: ReelsContainer;
    private scoreboard: Scoreboard;
    private victoryScreen: VictoryScreen;
    public firstPlayCalled: boolean;
    private krillLoaded: boolean;
    private gameLoaded: boolean;
    private loader: Loader;
    private time: Date;

    constructor() {
        this.krillLoaded = false;
        this.gameLoaded = false;
        this.app = new PIXI.Application({ width: 960, height: 536 });
        window.document.body.appendChild(this.app.view);
        this.loader = new Loader(this.app, this.krilloud_start.bind(this));
        this.firstPlayCalled = false;
        window.addEventListener("click", async () => {
            this.firstPlay();
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
        this.createPlayButton();
        this.createReels();
        this.createScoreboard();
        this.createVictoryScreen();
        this.gameLoaded = true;
        this.checkLoaded();
    }

    public async firstPlay() {
        if (!this.firstPlayCalled) {
            this.firstPlayCalled = true;
        }
    }

    private async krilloud_start() {
        let contractPath = "public/";
        let soundBankPath = "public/";
        await krilloudSDK.start(contractPath, soundBankPath);

        // Carga de tags
        var tagsToLoad = [
            { names: "music,UI", objectId: 3 },
            { names: "ruleta", objectId: 0 },
            { names: "fruits", objectId: 0 },
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

    private createPlayButton() {
        this.playBtn = new PlayButton(this.app, this.handleStart.bind(this));
        this.app.stage.addChild(this.playBtn.sprite);
    }

    private createReels() {
        this.reelsContainer = new ReelsContainer(this.app);
        this.app.stage.addChild(this.reelsContainer.container);
    }

    private createScoreboard() {
        this.scoreboard = new Scoreboard(this.app);
        this.app.stage.addChild(this.scoreboard.container);
    }

    private createVictoryScreen() {
        this.victoryScreen = new VictoryScreen(this.app);
        this.app.stage.addChild(this.victoryScreen.container);
    }

    async handleStart() {
        this.firstPlay();
        this.scoreboard.decrement();
        this.playBtn.setDisabled();
        this.reelsContainer.spin().then(this.processSpinResult.bind(this));
    }

    private async processSpinResult(isWin: boolean) {
        if (isWin) {
            this.scoreboard.increment();
            this.victoryScreen.show();

            krilloudSDK.setVar("win_loose", 3, 0);
            const playBackgroundSound = krilloudSDK.play("UI", 3);
        } else {
            krilloudSDK.setVar("win_loose", 3, 1);
            const playBackgroundSound = krilloudSDK.play("UI", 3);
        }

        if (!this.scoreboard.outOfMoney) this.playBtn.setEnabled();
    }
}
