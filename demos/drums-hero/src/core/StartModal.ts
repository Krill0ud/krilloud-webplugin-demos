import * as PIXI from 'pixi.js';

export default class StartModal {
    private app: PIXI.Application;
    private modalContainer: PIXI.Container;
    private playButton: PIXI.Graphics;
    private onPlayClick: () => void;

    constructor(app: PIXI.Application, onPlayClick: () => void) {
        this.app = app;
        this.onPlayClick = onPlayClick;

        // Crear el contenedor para el modal
        this.modalContainer = new PIXI.Container();
        this.app.stage.addChild(this.modalContainer);

        // Crear el fondo semitransparente
        const background = new PIXI.Graphics();
        background.beginFill(0x000000, 0.5); // Negro con 50% de opacidad
        background.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
        background.endFill();
        this.modalContainer.addChild(background);

        // Crear el botón de PLAY
        this.playButton = new PIXI.Graphics();
        this.playButton.beginFill(0x0b9c12); // Color verde
        this.playButton.drawRoundedRect(
            this.app.screen.width / 2 - 75, // Posición x
            this.app.screen.height / 2 - 25, // Posición y
            150, // Ancho
            50, // Alto
            15 // Radio de las esquinas
        );
        this.playButton.endFill();

        // Añadir interacción al botón de PLAY
        this.playButton.interactive = true;
        this.playButton.buttonMode = true;
        this.playButton.on('pointerdown', this.handlePlayClick.bind(this));

        // Añadir el botón al contenedor del modal
        this.modalContainer.addChild(this.playButton);

        // Añadir el texto del botón de PLAY
        const playText = new PIXI.Text('PLAY', {
            fontSize: 24,
            fill: 0xffffff // Color blanco
        });
        playText.anchor.set(0.5);
        playText.x = this.app.screen.width / 2;
        playText.y = this.app.screen.height / 2;
        this.modalContainer.addChild(playText);
    }

    private handlePlayClick() {
        if (this.onPlayClick) {
            this.onPlayClick();
        }
        this.hide();
    }

    public show() {
        this.modalContainer.visible = true;
    }

    public hide() {
        this.modalContainer.visible = false;
    }
}

