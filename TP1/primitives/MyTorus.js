/**
 * MyTorus
 * @constructor
 * @param Scene
 * 
 */
class MyTorus extends CGFobject {
    constructor(scene, out_r, in_r, slices, loops) {
        super(scene);

        this.out_r = out_r;
        this.in_r = in_r;
        this.slices = slices;
        this.loops = loops;

        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.normals = [];
        this.indices = [];
        this.texCoords = [];

        for (let j = 0; j <= this.loops; j++) {
          let theta = Math.PI * 2 * j / this.loops;
    
          for (let i = 0; i <= this.slices; i++) {
            let alpha = i / this.slices * Math.PI * 2;
    
            this.vertices.push(
                Math.cos(alpha) * (this.out_r + this.in_r * Math.cos(theta)),
                Math.sin(alpha) * (this.out_r + this.in_r * Math.cos(theta)),
                Math.sin(theta) * this.in_r
            );
    
            this.normals.push(
                Math.cos(alpha) * (this.out_r + this.in_r * Math.cos(theta)) - Math.cos(alpha) * this.out_r,
                Math.sin(alpha) * (this.out_r + this.in_r * Math.cos(theta)) - Math.sin(alpha) * this.out_r,
                Math.sin(theta) * this.in_r
            );
    
            this.texCoords.push(i / this.slices);
            this.texCoords.push(j / this.loops);
          }
        }
        for (let j = 1; j <= this.loops; j++) {
          for (let i = 1; i <= this.slices; i++) {

            var a = (this.slices + 1) * j + i - 1;
            var b = (this.slices + 1) * (j - 1) + i - 1;
            var c = (this.slices + 1) * (j - 1) + i;
            var d = (this.slices + 1) * j + i;
    
            this.indices.push(a, b, d);
            this.indices.push(b, c, d);
          }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}