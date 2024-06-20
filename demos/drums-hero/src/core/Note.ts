import * as PIXI from 'pixi.js';

export default class Note {
    public readonly sprite: PIXI.Sprite;
    private readonly onClick: () => void;
    private readonly activeTexture: PIXI.Texture;
    private readonly ticker: PIXI.Ticker;

    constructor(app: PIXI.Application, onClick: () => void, noteIndex: number) {
        this.onClick = onClick;
        this.activeTexture = app.loader.resources!.atlas.textures!['BTN_Note_' + noteIndex + '.png'];
        this.ticker = app.ticker;
        this.sprite = new PIXI.Sprite(this.activeTexture);
        this.init(app.screen.width, app.screen.height, noteIndex);
        this.sprite.interactive = false;
        
        app.stage.addChild(this.sprite);
    
    }

    private init(appWidth: number, appHeight: number, noteIndex: number) {
        this.sprite.x = (noteIndex * appWidth / 4) - this.sprite.width - 17.5 ;
        this.sprite.y = -(this.sprite.height / 2);
        this.sprite.interactive = true;
        this.sprite.buttonMode = true;
        this.sprite.addListener('pointerdown', this.onClick);

        
        this.ticker.add(() =>
        {
            this.sprite.y += (4 * this.ticker.deltaTime);
            if(this.sprite.y >= (11 * (appHeight - this.sprite.height/2) / 12) ){
                this.sprite.destroy;
            }
        })

        
    }
    
}
