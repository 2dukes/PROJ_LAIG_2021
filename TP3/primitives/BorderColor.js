/**
 * BorderColor
 * @constructor
 * @param Scene
 * 
 */
class BorderColor extends CGFobject {
    constructor(scene, borderAp) {
        super(scene);

        this.purple = new MyTriangle(this.scene, 0, 1, 0.5, 0, 0, 0.5*Math.tan(30*Math.PI/180));

        this.borderAp = borderAp;
        
    }

    display() {

        this.scene.pushMatrix();

        this.borderAp.apply();
        this.scene.translate(-1.65,-0.85,0.04);
        this.scene.rotate(30*Math.PI/180, 0, 0, 1);
        this.scene.scale(2.05,2.05,0);
        this.purple.display();

        this.scene.popMatrix();

        this.scene.pushMatrix();

        this.borderAp.apply();
        this.scene.translate(2.4,-3.95,0.04);
        this.scene.rotate(210*Math.PI/180, 0, 0, 1);
        this.scene.scale(2.05,2.05,0);
        this.purple.display();

        this.scene.popMatrix();
        
    }

    updateTexCoords(afs, aft) {
    
    }

}