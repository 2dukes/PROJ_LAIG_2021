class MyTile {
    constructor(gameBoard, scene, radius, line, diagonal, diagonalSP, diagonalStartingLine) {
        this.gameBoard = gameBoard;
        this.scene = scene;
        this.line = line;
        this.diagonal = diagonal;
        this.radius = radius;
        this.piece = null;
        this.isPicked = false;
        this.tile = new MyCylinder(this.scene, this.radius, this.radius, 0.1, 6, 6);


        this.defaultAp=new CGFappearance(this.scene);
        this.defaultAp.setAmbient(0.5,0.5,0.5,1); // Ambient RGB
        this.defaultAp.setDiffuse(0.5,0.5,0.5,1); // Diffuse RGB
        this.defaultAp.setSpecular(0.5,0.5,0.5,1); // Specular RGB
        this.defaultAp.setEmission(0.5,0.5,0.5,1); // Emissive RGB
        this.defaultAp.setShininess(1);

        this.texture1 = new CGFtexture(this.scene, "./scenes/images/tiles/empty_tile.png");
        this.defaultAp.setTexture(this.texture1);
        this.defaultAp.setTextureWrap('REPEAT', 'REPEAT');
        this.defaultAp.apply();


        this.otherAppearance=new CGFappearance(this.scene);
        this.otherAppearance.setAmbient(0,1,0,1); // Ambient RGB
        this.otherAppearance.setDiffuse(0,1,0,1); // Diffuse RGB
        this.otherAppearance.setSpecular(0,1,0,1); // Specular RGB
        this.otherAppearance.setEmission(0,1,0,1); // Emissive RGB
        this.otherAppearance.setShininess(10); 

        this.texture2 = new CGFtexture(this.scene, "./scenes/images/tiles/green_tile.png");
        this.otherAppearance.setTexture(this.texture1);
        this.otherAppearance.setTextureWrap('REPEAT', 'REPEAT');
        this.otherAppearance.apply();
        
        this.getCoords(diagonalSP, diagonalStartingLine);
    }

    getCoords(diagonalSP, diagonalStartingLine) {
        let numberOfTransfs = this.line - diagonalStartingLine;
        let auxiliarRadius = (this.radius * Math.sqrt(3)) / 2;

        this.xOffset = diagonalSP.x - numberOfTransfs * (this.radius + (auxiliarRadius / 2));
        this.yOffset = diagonalSP.y - numberOfTransfs * auxiliarRadius;
        // console.log(this.xOffset, this.yOffset);
    }

    display() {

        

        this.scene.pushMatrix();

        if (this.isPicked) {
            this.otherAppearance.apply();
        }
        else {
            this.defaultAp.apply();
        }

        this.scene.translate(this.xOffset, this.yOffset, 0);
        this.tile.display();

        //this.defaultAp.apply();
        this.scene.popMatrix();

        
    }

    // <gameboard x1="" y2="" x2="" y2="">
    //     <tiles radius="" />
    // </gameboard>

    // <piece type="cylinder" colour="green/orange/purple" />

}

