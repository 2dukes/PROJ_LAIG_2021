/**
 * BorderColor
 * @constructor
 * @param Scene
 * 
 */
class BorderColor extends CGFobject {
    constructor(scene, purpleAp, greenAp, orangeBorder) {
        super(scene);

        this.purple = new MyTriangle(this.scene, 0, 1, 0.5, 0, 0, 0.5*Math.tan(30*Math.PI/180));

        this.purpleAp = purpleAp;
        this.greenAp = greenAp;
        this.orangeBorder = orangeBorder;
        
    }

    display() {

        this.scene.pushMatrix();
        this.purpleAp.apply();
        this.scene.translate(-1.65,-0.85,0.04);
        this.scene.rotate(30*Math.PI/180, 0, 0, 1);
        this.scene.scale(2.05,2.05,0);
        this.purple.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(2.35,-3.93,0.04);
        this.scene.rotate(210*Math.PI/180, 0, 0, 1);
        this.scene.scale(2.05,2.05,0);
        this.purple.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.greenAp.apply();
        this.scene.translate(0.6,0.2,0.04);
        this.scene.rotate(-30*Math.PI/180, 0, 0, 1);
        this.scene.scale(2.05,2.05,0);
        this.purple.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0.15,-4.95,0.04);
        this.scene.rotate(150*Math.PI/180, 0, 0, 1);
        this.scene.scale(2.05,2.05,0);
        this.purple.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.orangeBorder.apply();
        this.scene.translate(2.63,-1.37,0.04);
        this.scene.rotate(-90*Math.PI/180, 0, 0, 1);
        this.scene.scale(2.05,2.05,0);
        this.purple.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-1.92,-3.4,0.04);
        this.scene.rotate(90*Math.PI/180, 0, 0, 1);
        this.scene.scale(2.05,2.05,0);
        this.purple.display();
        this.scene.popMatrix();
        
    }

    updateTexCoords(afs, aft) {
    
    }

}