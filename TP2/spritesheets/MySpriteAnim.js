class MySpriteAnim {
    constructor(scene, spriteSheet, duration, startCell, endCell) {
        this.scene = scene;

        this.spriteSheet = spriteSheet;
        this.duration = duration;
        this.startCell = startCell;
        this.endCell = endCell;
        
        // initialize base geometry
        this.rectangle = new MyRectangle(this.scene, 0, 0, 1, 1);

        // Animation - Related Variables
        this.currentSprite = startCell;
        this.elapsedTime = 0;
        this.timePerCell = duration / (endCell - startCell + 1);

        this.numCells = endCell - startCell + 1;
    }

    update(timeIncrement) {

        this.elapsedTime += timeIncrement;

        // Calculate which sprite cell is active
        // % this.numCells --> the animation will run forever
        this.currentSprite = Math.floor(this.elapsedTime / this.timePerCell + this.startCell) % this.numCells;

    }
    
    display() {
        
        // activate corresponding sprite
        this.spriteSheet.activateCellP(this.currentSprite);

        // display base geometry

        this.rectangle.display();

        // active default shader
        this.spriteSheet.setDefaultShader();
    }

    updateTexCoords() {

    }
}