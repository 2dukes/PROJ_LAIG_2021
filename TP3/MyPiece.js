class MyPiece {
    constructor(scene, radius, appearance, heigh) {
        this.scene = scene;
        this.radius = radius;
        this.heigh = heigh;
        
        this.tile = new MyCylinder(this.scene, this.radius, this.radius, 0.2, 6, 1);

        this.appearance = appearance;
        

    }

    display() {   

        this.scene.pushMatrix();
        this.appearance.apply();

        this.scene.translate(0, 0, this.heigh);
        this.tile.display();

        this.scene.popMatrix();
    }

}

