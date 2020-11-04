class MySpriteText {
    constructor(scene, text) {
        this.scene = scene;
        this.text = text;

        this.rectangles = [];
        for(let i = 0; i < this.text.length; i++) 
            rectangles[i] = new MyRectangle(this.scene, this.scene, 0, 0, 1, 1);
        
        // the font texture has 16 columns and 16 rows
        this.spritesheet = MySpritesheet('/textures/oolite-font.png', 16, 16, this.scene);
    }

    display() {
        // Loop through text characters
        // 1. Get character's sprite position -> getCharacterPosition(char)
        // 2. Activate Sprite -> ActivateCellP()
        // 3. Display base geometry

    }

    getCharacterPosition(char) {
        // Depends on chosen texture
    }
}