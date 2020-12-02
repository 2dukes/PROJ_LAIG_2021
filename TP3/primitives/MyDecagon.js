/**
 * MyDecagon
 * @constructor
 * @param Scene
 * 
 */
class MyDecagon extends CGFobject {
    constructor(scene) {
        super(scene);

        this.cylinder = new MyCylinder(this.scene, 0.25, 0.25, 0.05, 6, 1);

        this.defaultAp=new CGFappearance(this.scene);
        this.defaultAp.setAmbient(0.5,0.5,0.5,1); // Ambient RGB
        this.defaultAp.setDiffuse(0.5,0.5,0.5,1); // Diffuse RGB
        this.defaultAp.setSpecular(0.5,0.5,0.5,1); // Specular RGB
        this.defaultAp.setEmission(0.5,0.5,0.5,1); // Emissive RGB
        this.defaultAp.setShininess(1);

        this.texture1 = new CGFtexture(this.scene, "./scenes/images/tronco.jpg");
        this.defaultAp.setTexture(this.texture1);
        this.defaultAp.setTextureWrap('REPEAT', 'REPEAT');
        this.defaultAp.apply();
        
    }

    display() {

        this.defaultAp.apply();

        this.scene.pushMatrix();

        this.scene.translate(-1,0.1,0.05);
        
        this.cylinder.display();

        this.scene.popMatrix();
        
    }

    updateTexCoords(afs, aft) {
    
    }

}