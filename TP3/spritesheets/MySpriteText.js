class MySpriteText {
    constructor(scene, text, width) {
        this.scene = scene;
        this.text = text;

        this.rectangleWidth = width;
        this.startPosition = (text.length / 2) / 2;

        // Create the rectangle primitive
        this.rectangle = new MyRectangle(this.scene, 0, 0, this.rectangleWidth, this.rectangleWidth);
        // Create the texture of the font sprite
        this.texture = new CGFtexture(this.scene, 'textures/oolite-font.png');
        
        // The font sprite has 16 columns and 16 rows
        this.spritesheet = new MySpriteSheet(this.scene, this.texture, 16, 16);
    }

    display(text) {
        if (text == undefined) text = this.text;
        for (let i = 0; i < text.length; i++) {
            
            // Get character's sprite position
            let p = this.getCharacterPosition(text[i]);

            // Activate Sprite
            this.spritesheet.activateCellP(p);

            // Making the translation of the base geometry and the corresponding display
            this.scene.pushMatrix();
            
            this.scene.translate(i * this.rectangleWidth - this.startPosition, 0, 0);
            
            this.rectangle.display();
            this.scene.popMatrix();

            // Active default shader
            this.spritesheet.setDefaultShader();
        }
    }

    // returns the p value position of the char in the texture, which is the corresponding ASCII code
    getCharacterPosition(char) {
        return char.charCodeAt(0);
    }

    updateTexCoords() {
        
    }
}