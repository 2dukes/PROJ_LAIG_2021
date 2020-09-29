class MyCylinder extends CGFobject {
    constructor(scene, nDivs) {
        super(scene);

        this.nDivs = nDivs;

        this.initBuffers();
    }

    initBuffers() {

        // Generate Vertices & Normals
        this.vertices = [];
        this.normals = [];
        var angle = 0;
        
        for(var i = 0; i < this.nDivs; i++) {
            this.normals.push(Math.cos(angle), 0, Math.sin(angle));
            this.normals.push(Math.cos(angle), 1, Math.sin(angle));
            this.vertices.push(Math.cos(angle), 0, Math.sin(angle)); // Bottom 
            this.vertices.push(Math.cos(angle), 1, Math.sin(angle)); // Tops
            angle += ((360 / this.nDivs) * Math.PI) / 180; // Converting to radians
        }

       
        // Generate Indices -- Per face (non-including the last-one)
        this.indices = [];
        for (var i = 0; (i + 3) < this.nDivs * 2; i += 2) {
            // 1st Triangle
            this.indices.push(i, i + 1, i + 2);

            // 2nd Triangle
            this.indices.push(i + 3, i + 2, i + 1);
        }

        // Generate indices -- Per face (last one)
        var aux = this.indices[this.indices.length - 3 ];

        this.indices.push(aux, 1, aux - 1);
        this.indices.push(aux - 1, 1, 0);

        // -- Repeat 1st line of vertices. Useful for texture
        this.vertices.push(1, 0, 0);
        this.vertices.push(1, 1, 0);
        this.normals.push(1, 0, 0);
        this.normals.push(1, 1, 0);

        var bottom = aux + 1;
        var top = aux + 2;

        this.indices.push(aux, top, aux - 1);
        this.indices.push(aux - 1, top, bottom);

        // Generate texCoords

        this.texCoords = [];
         
        var x = 1;
        var toDecrement = 1 / this.nDivs;
        for(var i = 0; i < this.nDivs; i++) {
            this.texCoords.push(x, 1);
            this.texCoords.push(x, 0);
            x -= toDecrement;
        }
        
        this.texCoords.push(0, 1);
        this.texCoords.push(0, 0); 

        this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
    }
}