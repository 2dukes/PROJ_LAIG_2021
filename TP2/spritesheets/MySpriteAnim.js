class MySpriteAnim {
    constructor(scene, spriteSheet, duration, startCell, endCell) {
        this.scene = scene;
        this.spriteSheet = spriteSheet;
        this.duration = duration;
        this.startCell = startCell;
        this.endCell = endCell;

        // the explosion texture has 4 columns and 4 rows
        this.spritesheet = MySpritesheet(this.scene, '/textures/explosion.png', 4, 4);
        
        // initialize base geometry
        this.rectangle = new MyRectangle(this.scene, 0, 0, 1, 1);

        // Animation - Related Variables
        this.currentSprite = startCell;
        this.elapsedTime = 0;
        this.timePerCell = duration / (endCell - startCell + 1);

        this.animationEnded = false;
    }

    update(timeIncrement) {
        if (this.animationEnded)
            return;

        this.elapsedTime += timeIncrement;

        // Calculate which sprite cell is active
        this.currentSprite = this.elapsedTime / this.timePerCell + this.startCell;

        // check if the animation has ended
        if (this.currentSprite > this.endCell) {
            this.animationEnded = true;
            return;
        }
    }
    
    display() {
        if (this.animationEnded)
            return;

        // activate corresponding sprite
        this.spritesheet.activateCell(this.currentSprite);

        // display base geometry
        this.rectangle.display();

    }
}