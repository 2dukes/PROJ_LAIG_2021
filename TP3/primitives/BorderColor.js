/**
 * BorderColor
 * @constructor
 * @param Scene
 * 
 */
class BorderColor extends CGFobject {
    constructor(scene) {
        super(scene);

        // Inicializar um triângulo com um ângulo de 120º
        this.triangle = new MyTriangle(this.scene, 0, 1, 0.5, 0, 0, 0.5*Math.tan(30*Math.PI/180));

        this.initAppearances();
    }

    initAppearances() {
        this.purpleBorder=new CGFappearance(this.scene);
        this.purpleBorder.setAmbient(0.302,0,0.302,1); // Ambient RGB
        this.purpleBorder.setDiffuse(0.302,0,0.302,1); // Diffuse RGB
        this.purpleBorder.setSpecular(0.0,0,0.0,1); // Specular RGB
        this.purpleBorder.setEmission(0.1,0,0.1,1); // Emissive RGB
        this.purpleBorder.setShininess(1);

        this.greenBorder=new CGFappearance(this.scene);
        this.greenBorder.setAmbient(0,0.502,0,1); // Ambient RGB
        this.greenBorder.setDiffuse(0,0.502,0,1); // Diffuse RGB
        this.greenBorder.setSpecular(0,0,0,1); // Specular RGB
        this.greenBorder.setEmission(0,0,0,1); // Emissive RGB
        this.greenBorder.setShininess(1);

        this.orangeBorder=new CGFappearance(this.scene);
        this.orangeBorder.setAmbient(100,0.4,0,1); // Ambient RGB
        this.orangeBorder.setDiffuse(100,0.4,0,1); // Diffuse RGB
        this.orangeBorder.setSpecular(0,0,0,1); // Specular RGB
        this.orangeBorder.setEmission(0,0,0,1); // Emissive RGB
        this.orangeBorder.setShininess(1);
    }

    display() {

        this.scene.pushMatrix();
        this.purpleBorder.apply();
        this.scene.translate(-1.65,-0.85,0.04);
        this.scene.rotate(30*Math.PI/180, 0, 0, 1);
        this.scene.scale(2.05,2.05,0);
        this.triangle.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(2.35,-3.93,0.04);
        this.scene.rotate(210*Math.PI/180, 0, 0, 1);
        this.scene.scale(2.05,2.05,0);
        this.triangle.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.greenBorder.apply();
        this.scene.translate(0.6,0.2,0.04);
        this.scene.rotate(-30*Math.PI/180, 0, 0, 1);
        this.scene.scale(2.05,2.05,0);
        this.triangle.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0.15,-4.95,0.04);
        this.scene.rotate(150*Math.PI/180, 0, 0, 1);
        this.scene.scale(2.05,2.05,0);
        this.triangle.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.orangeBorder.apply();
        this.scene.translate(2.63,-1.37,0.04);
        this.scene.rotate(-90*Math.PI/180, 0, 0, 1);
        this.scene.scale(2.05,2.05,0);
        this.triangle.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-1.92,-3.4,0.04);
        this.scene.rotate(90*Math.PI/180, 0, 0, 1);
        this.scene.scale(2.05,2.05,0);
        this.triangle.display();
        this.scene.popMatrix();
        
    }

    updateTexCoords(afs, aft) {
    
    }

}