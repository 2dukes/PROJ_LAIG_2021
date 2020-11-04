class MySpriteText {
    constructor(scene, text) {
        this.scene = scene;
        this.text = text;

        this.rectangles = [];
        for(let i = 0; i < this.text.length; i++) 
            this.rectangles[i] = new MyRectangle(this.scene, 0, 0, 1, 1);

        this.texture = new CGFtexture(this.scene, 'textures/oolite-font.png');
        
        // the font texture has 16 columns and 16 rows
        this.spritesheet = new MySpriteSheet(this.scene, this.texture, 16, 16);

        
    }

    display() {
        for (let i = 0; i < this.text.length; i++) {
            
            // Get character's sprite position
            let p = this.getCharacterPosition(this.text[i]);

            // Activate Sprite
            this.spritesheet.activateCellP(p);

            // Making the translation of the base geometry and the corresponding display
            this.scene.pushMatrix();
            this.scene.translate(i, 0, 0);
            this.rectangles[i].display();
            this.scene.popMatrix();

            // Active default shader
            this.spritesheet.setDefaultShader();
        } 

        /* this.spritesheet.activateCellP(5);
        this.rectangles[0].display();
        this.spritesheet.setDefaultShader(); */
    }

    // returns the p value position of the char in the texture
    getCharacterPosition(char) {
        return char.charCodeAt(char);
    }

    updateTexCoords() {
        
    }
}