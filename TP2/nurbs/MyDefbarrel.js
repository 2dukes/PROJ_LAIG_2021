class Plane extends CGFobject {
    constructor(scene, base, middle, heigth, slices, stacks) {
        super(scene);

        this.base = base;
        this.middle = middle;
        this.height = height;
        this.slices = slice;
        this.stacks = stacks;

        this.init();
    }

    init() {

        let controlPoints = [ 
               // U = 0
            [
                [-0.5, 0.0, 0.5, 1],
                [-0.5, 0.0, -0.5, 1],
                [-0.5, 0.0, 0.5, 1],
                [-0.5, 0.0, -0.5, 1]
            ], // U = 1
            [
                [0.5, 0.0, 0.5, 1],
                [0.5, 0.0, -0.5, 1],
                [-0.5, 0.0, 0.5, 1],
                [-0.5, 0.0, -0.5, 1]
            ], // U = 2
            [
                [0.5, 0.0, 0.5, 1],
                [-0.5, 0.0, 0.5, 1],
                [-0.5, 0.0, -0.5, 1],
                [0.5, 0.0, -0.5, 1]
            ], // U = 3
            [
                [0.5, 0.0, 0.5, 1],
                [-0.5, 0.0, 0.5, 1],
                [-0.5, 0.0, -0.5, 1],
                [0.5, 0.0, -0.5, 1]
            ],

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