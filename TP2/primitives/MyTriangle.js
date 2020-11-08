/**
 * MyTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyTriangle extends CGFobject {
    constructor(scene, x1, x2, x3, y1, y2, y3) {
        super(scene);

        this.x1 = x1;
        this.x2 = x2;
        this.x3 = x3;
        this.y1 = y1;
        this.y2 = y2;
        this.y3 = y3;
        this.z1 = 0;
        this.z2 = 0;
        this.z3 = 0;

        this.initBuffers();
    }
    initBuffers() {
        this.vertices = [
            this.x1, this.y1, this.z1,
            this.x2, this.y2, this.z2,
            this.x3, this.y3, this.z3,
        ];

        this.indices = [
            0, 1, 2
        ];

        this.normals = [
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1
        ];

        this.texCoords = [
			0, 1,
			1, 1,
            0, 0,
            1, 0
		]

        this.primitiveType = this.scene.gl.TRIANGLES;

		this.initGLBuffers();
    }

    updateTexCoords(afs, aft) {

        // distance calculation between vertices
		var a = Math.sqrt(Math.pow(this.x2 - this.x1, 2) + Math.pow(this.y2 - this.y1, 2) + Math.pow(this.z2 - this.z1, 2));
		var b = Math.sqrt(Math.pow(this.x3 - this.x2, 2) + Math.pow(this.y3 - this.y2, 2) + Math.pow(this.z3 - this.z2, 2));
		var c = Math.sqrt(Math.pow(this.x1 - this.x3, 2) + Math.pow(this.y1 - this.y3, 2) + Math.pow(this.z1 - this.z3, 2));

        // calculation of the angle between the sides 'a' and 'c'
		var alpha = Math.acos((Math.pow(a, 2) - Math.pow(b, 2) + Math.pow(c, 2)) / (2 * a * c));

        // UV texture mapping calculation
        var T1 = [0, 1];
        var T2 = [a / afs, 1];
        var T3 = [c * Math.cos(alpha) / afs, 1- (c* Math.sin(alpha) / aft)];

		this.texCoords = [
			T1[0], T1[1],
			T2[0], T2[1],
			T3[0], T3[1]
		];

		this.updateTexCoordsGLBuffers();
	}
}