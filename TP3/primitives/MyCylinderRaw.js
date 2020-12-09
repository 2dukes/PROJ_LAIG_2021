/**
 * MyCylinderRaw
 * @constructor
 * @param Scene
 * 
 */
class MyCylinderRaw extends CGFobject {
    constructor(scene, base_r, top_r, height, slices, stacks) {
        super(scene);
        
        this.base_r = base_r;
        this.top_r = top_r;
        this.height = height;
        this.slices = slices;
        this.stacks = stacks;

        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];
        this.originalTexCoords = [];

        var deltaAng = 2*Math.PI/this.slices;
        var deltaStack = this.height/this.stacks;
        var deltaRad = (this.top_r-this.base_r)/this.stacks;

        for(let i=0; i<=this.slices; i++) {
            for(let j=0; j<=this.stacks; j++) {
                this.vertices.push(
                    Math.cos(deltaAng*i)*(this.base_r+deltaRad*j),
                    Math.sin(deltaAng*i)*(this.base_r+deltaRad*j),
                    j*deltaStack
                );

				this.originalTexCoords.push(i*1/this.stacks, 1 - (j*1/this.slices));

                this.normals.push(Math.cos(deltaAng*i), Math.sin(deltaAng*i), 0);
            }
        }

		for(let i=0; i<this.slices; i++) {
			for(let j=0; j<this.stacks; j++) {
                this.indices.push(i*(this.stacks+1)+j, (i+1)*(this.stacks+1)+j, (i+1)*(this.stacks+1)+j+1);
                this.indices.push(i*(this.stacks+1)+j+1, i*(this.stacks+1)+j, (i+1)*(this.stacks+1)+j+1);
            }
        }

        this.texCoords = this.originalTexCoords.slice();
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();	

    }

	updateTexCoords(afs, aft) {
    
    }
}