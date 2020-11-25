class Plane extends CGFobject {
    constructor(scene, nPartsU, nPartsV) {
        super(scene);

        this.nPartsU = nPartsU;
        this.nPartsV = nPartsV;

        this.init();

        this.initBuffers();
    }

    init() {
        let controlPoints = [ 
            [
                [-0.5, 0.0, 0.5, 1], // P1
                [-0.5, 0.0, -0.5, 1] // P2
            ],
            [
                [0.5, 0.0, 0.5, 1],  // P3
                [0.5, 0.0, -0.5, 1]  // P4
            ]
        ];

        let nurbsSurface = new CGFnurbsSurface(1, 1, controlPoints);
        this.nSurface = new CGFnurbsObject(this.scene, this.nPartsU, this.nPartsV, nurbsSurface); 
    }

    display() {

        this.nSurface.display();
    }

    updateTexCoords(s, t) {
        
    }
}