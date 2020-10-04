/**
 * MyCylinder
 * @constructor
 * @param Scene
 * 
 */
class MyCylinder extends CGFobject {
    constructor(scene, base_r, top_r, height, slices, stacks) {
        super(scene);

        this.base_r = base_r;
        this.top_r = top_r;
        this.height = height;
        this.slices = slices;
        this.stacks = stacks;

        this.cylinderRaw = new MyCylinderRaw(scene, base_r, top_r, height, slices, stacks);
        this.circle_base = new MyCircle(scene, slices, base_r);
        this.circle_top = new MyCircle(scene, slices, top_r);
    }

    display() {
        
        this.cylinderRaw.display();

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.circle_base.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 0, this.height);
        this.circle_top.display();
        this.scene.popMatrix();
    }

}