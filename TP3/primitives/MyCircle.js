/**
 * MyCircle
 * @extends {CGFobject}
 */
class MyCircle extends CGFobject {

    constructor(scene, slices, radius) {
      super(scene);
  
      this.slices = slices;
      this.radius = radius;
      this.delta = 2 * Math.PI / this.slices;
  
      this.vertices = [];
      this.indices = [];
      this.normals = [];
      this.texCoords = [];
  
      this.initBuffers();
    };
  
    initBuffers() {
      for (var slice = 0; slice < this.slices; slice++) {

          this.vertices.push(Math.cos(slice * this.delta)*this.radius);
          this.vertices.push(Math.sin(slice * this.delta)*this.radius);
          this.vertices.push(0);
          }
      
          this.vertices.push(0, 0, 0);
      
          for (var slice = 0; slice < this.slices + 1; slice++) {
          this.normals.push(0, 0, 1);
          }
      
          for (var slice = 0; slice < this.slices; slice++) {
          this.indices.push(slice, (slice + 1) % this.slices, this.slices);
          }
      
          for (var slice = 0; slice < 3 * (this.slices + 1); slice += 3) {
          this.texCoords.push(this.vertices[slice] / 2 + 0.5, -(this.vertices[slice + 1] / 2 + 0.5));
          }

          this.primitiveType = this.scene.gl.TRIANGLES;
          this.initGLBuffers();
      };
  };