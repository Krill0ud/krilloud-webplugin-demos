import * as PIXI from 'pixi.js';
import axios from 'axios';
import Note from './Note';
import DrumsButtons from './DrumsButtons';

declare var krilloudSDK: any;

export default class Notes {
    private readonly onClick: () => void;
    private readonly ticker: PIXI.Ticker;
    private notes: Array<Note> = [];    
    private song: number[][];
    private drums: DrumsButtons;
    private app: PIXI.Application;
    
    constructor(app: PIXI.Application, onClick: () => void) {
        this.onClick = onClick;
        this.ticker = app.ticker;
        this.app = app;
        this.song = [];

        this.drums = new DrumsButtons(app, this.onClick);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.checkNotesPosition = this.checkNotesPosition.bind(this);
        window.addEventListener('keydown', this.handleKeyDown);
        this.ticker.add(this.checkNotesPosition, this);

        this.loadSong();
    }

    private async loadSong() {
        try {
            const response = await axios.get('../public/song.json'); // Reemplaza 'path/to/your/song.json' con la ruta real de tu archivo JSON
            this.song = response.data;
            this.init(this.app, this.app.screen.width, this.app.screen.height);
        } catch (error) {
            console.error("Error loading song:", error);
        }
    }

    private async init(app: PIXI.Application, appWidth: number, appHeight: number) {
        for (let i = 0; i < this.song.length; i++) {
            const currentNotes = this.song[i];
            for (let j = 0; j < currentNotes.length; j++) {
                if (currentNotes[j] === 1) {
                    this.notes.push(new Note(app, this.onClick, j + 1));
                }
            }
            await this.delay(166.67);
        }
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private handleKeyDown(event: KeyboardEvent) {
        let columnIndex: number | null = null;
        switch (event.key.toLowerCase()) {
            case 'q':
                columnIndex = 0;
                break;
            case 'w':
                columnIndex = 1;
                break;
            case 'e':
                columnIndex = 2;
                break;
            case 'r':
                columnIndex = 3;
                break;
        }
        if (columnIndex !== null) {
            this.checkNoteHit(columnIndex);
        }
    }

    private checkNoteHit(columnIndex: number) {
        const drumSprites = [
            this.drums.drumsSprites[0],
            this.drums.drumsSprites[1],
            this.drums.drumsSprites[2],
            this.drums.drumsSprites[3]
        ];
        const drumY = drumSprites[columnIndex].y;
        if (this.notes[0].sprite.x === drumSprites[columnIndex].x && Math.abs(this.notes[0].sprite.y - drumY) < 30) {
            krilloudSDK.setVar("drums_var", 0, 2)
            krilloudSDK.setVar("music_drums", 1, 1);
            krilloudSDK.setVar("music_no_drums", 1, 0);
            this.notes[0].sprite.visible = false;
            this.notes.shift();
        } else {
            krilloudSDK.play("Fail", 2)
            krilloudSDK.setVar("music_drums", 1, 0);
            krilloudSDK.setVar("music_no_drums", 1, 1);
        }
    }

    private checkNotesPosition() {
        if (this.notes.length > 0) {
            const lastNote = this.notes[0];
            if (lastNote.sprite.y >= (11 * (this.app.screen.height - lastNote.sprite.height / 2) / 12)) {
                lastNote.sprite.visible = false;
                this.notes.shift();
                krilloudSDK.setVar("music_drums", 1, 0);
                krilloudSDK.setVar("music_no_drums", 1, 1);
            }
        }
    }
}
