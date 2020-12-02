class MyAuxBoard {
    constructor(scene) {
        this.scene = scene;

        this.initAppearances();

        this.purplePieces = [];
        this.greenPieces = [];
        this.orangePieces = [];
        this.initializePieces();
    }

    initAppearances() {
        this.purplePieceAp=new CGFappearance(this.scene);
        this.purplePieceAp.setAmbient(0.302,0,0.302,1); // Ambient RGB
        this.purplePieceAp.setDiffuse(0.302,0,0.302,1); // Diffuse RGB
        this.purplePieceAp.setSpecular(0.0,0,0.0,1); // Specular RGB
        this.purplePieceAp.setEmission(0.1,0,0.1,1); // Emissive RGB
        this.purplePieceAp.setShininess(1);

        this.texture1 = new CGFtexture(this.scene, "./scenes/images/tiles/purple_tile.png");
        this.purplePieceAp.setTexture(this.texture1);
        this.purplePieceAp.setTextureWrap('REPEAT', 'REPEAT');
        this.purplePieceAp.apply();

        this.greenPieceAp=new CGFappearance(this.scene);
        this.greenPieceAp.setAmbient(0,0.502,0,1); // Ambient RGB
        this.greenPieceAp.setDiffuse(0,0.502,0,1); // Diffuse RGB
        this.greenPieceAp.setSpecular(0,0,0,1); // Specular RGB
        this.greenPieceAp.setEmission(0,0,0,1); // Emissive RGB
        this.greenPieceAp.setShininess(1);

        this.texture2 = new CGFtexture(this.scene, "./scenes/images/tiles/green_tile.png");
        this.greenPieceAp.setTexture(this.texture2);
        this.greenPieceAp.setTextureWrap('REPEAT', 'REPEAT');
        this.greenPieceAp.apply();

        this.orangePieceAp=new CGFappearance(this.scene);
        this.orangePieceAp.setAmbient(100,0.4,0,1); // Ambient RGB
        this.orangePieceAp.setDiffuse(100,0.4,0,1); // Diffuse RGB
        this.orangePieceAp.setSpecular(0,0,0,1); // Specular RGB
        this.orangePieceAp.setEmission(0,0,0,1); // Emissive RGB
        this.orangePieceAp.setShininess(1);

        this.texture3 = new CGFtexture(this.scene, "./scenes/images/tiles/orange_tile.png");
        this.orangePieceAp.setTexture(this.texture3);
        this.orangePieceAp.setTextureWrap('REPEAT', 'REPEAT');
        this.orangePieceAp.apply();
    }

    initializePieces() {

        for (let i = 0, heigh = 0; i < 42; i++, heigh += 0.1) {
           this.purplePieces.push(new MyPiece(this.scene, 0.25, this.purplePieceAp, heigh));
           this.greenPieces.push(new MyPiece(this.scene, 0.25, this.greenPieceAp, heigh));
           this.orangePieces.push(new MyPiece(this.scene, 0.25, this.orangePieceAp, heigh));
        }
    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(-0.9,2.5,0.05);
        for (let i = 0; i < this.purplePieces.length; i++) {
            this.purplePieces[i].display();
        }
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0.9,2.5,0.05);
        for (let i = 0; i < this.purplePieces.length; i++) {
            this.greenPieces[i].display();
        }
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0,2.5,0.05);
        for (let i = 0; i < this.purplePieces.length; i++) {
            this.orangePieces[i].display();
        }
        this.scene.popMatrix();


    }
}
