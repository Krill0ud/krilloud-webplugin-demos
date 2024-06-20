import * as PIXI from 'pixi.js';

export default class DrumsButtons {
    public readonly drumsSprites: Array<PIXI.Sprite> = [];
    private readonly onClick: () => void;
    private readonly activeTexture: PIXI.Texture;
    private readonly disabledTexture: PIXI.Texture;
    app: PIXI.Application

    constructor(app: PIXI.Application, onClick: () => void) {
        this.onClick = onClick;
        this.activeTexture = app.loader.resources!.atlas.textures!['BTN_Kick.png'];
        this.app = app;

        for (let i = 0; i < 4; i++)
        {
            this.drumsSprites.push(new PIXI.Sprite(this.activeTexture));
        }

        this.init(app.screen.width, app.screen.height);
    }

    private init(appWidth: number, appHeight: number) {

        for (let i = 0; i < 4; i++)
        {
            this.drumsSprites[i].x = ((i + 1) * appWidth / 4) - this.drumsSprites[i].width - 17.5 ;
            this.drumsSprites[i].y = 11 * (appHeight - this.drumsSprites[i].height) / 12;
            this.drumsSprites[i].interactive = true;
            this.drumsSprites[i].buttonMode = true;
            this.drumsSprites[i].addListener('pointerdown', this.onClick);

            this.app.stage.addChild(this.drumsSprites[i]);
        }
    }
}