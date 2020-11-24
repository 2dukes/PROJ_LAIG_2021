class MySpriteText {
    constructor(scene, text) {
        this.scene = scene;
        this.text = text;

        this.rectangleWidth = 0.5;
        this.startPosition = (text.length / 2) / 2;

        // Create the rectangles used to show the letters
        this.rectangles = [];
        for(let i = 0; i < this.text.length; i++) 
            this.rectangles[i] = new MyRectangle(this.scene, 0, 0, this.rectangleWidth, this.rectangleWidth);

        // Create the texture of the font sprite
        this.texture = new CGFtexture(this.scene, 'textures/oolite-font.png');
        
        // The font sprite has 16 columns and 16 rows
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
            
            this.scene.translate(i * this.rectangleWidth - this.startPosition, 0, 0);
            
            this.rectangles[i].display();
            this.scene.popMatrix();

            // Active default shader
            this.spritesheet.setDefaultShader();
        }
    }

    // returns the p value position of the char in the texture, which is the corresponding ASCII code
    getCharacterPosition(char) {
        return char.charCodeAt(char);
    }

    updateTexCoords() {
        
    }
}