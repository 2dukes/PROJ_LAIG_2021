class MySpriteAnim {
    constructor(scene, spriteSheet, duration, startCell, endCell) {
        this.scene = scene;
        this.spriteSheet = spriteSheet;
        this.duration = duration;
        this.startCell = startCell;
        this.endCell = endCell;

        // this.spritesheet = MySpriteSheet('/path/to/texture', nColumns, nLines, this.scene); 
        this.rectangle = new MyRectangle(this.scene, 0, 0, 1, 1);

        // Animation - Related Variables
        this.currentSprite = 0;
        this.elapsedTime = 0;
        this.timePerCell = duration / (endCell - startCell);
    }

    update(currentTime) {
        this.elapsedTime += currentTime;

        // Calculate which sprite cell is active (elapsedTime, duration, timePerCell)

        // Save Current State and other variables
    }
    
    display() {
        // 1. Activate Sprite, using this.currentSprite
        // 2. Display base geometry
    }
}