class Barrel extends CGFobject {
    constructor(scene, base, middle, heigth, slices, stacks) {
        super(scene);

        this.rSmall = base;
        this.rBig = middle;
        this.lBig = heigth;
        this.slices = slices;
        this.stacks = stacks;

        this.hBig = (4/3) * (this.rBig - this.rSmall);
        this.hSmall = (4/3) * this.rSmall;

        this.init();
    }

    init() {
        let x = Math.PI / 6 ;

        let controlPoints = [ 
               // U = 0 -> P4
            [
                [this.rSmall, 0.0, 0, 1],    // Q1
                [this.rSmall + this.hBig, 0.0, (this.hBig / Math.tan(x)), 1],   // Q2
                [this.rSmall + this.hBig, 0.0, this.lBig - (this.hBig / Math.tan(x)), 1],    // Q3
                [this.rSmall, 0.0, this.lBig, 1], // Q4
            ],
            [   // U = 1 -> P3
                [this.rSmall, this.hSmall, 0, 1],    // Q1
                [this.rSmall + this.hBig, this.hSmall + (4/3) * this.hBig, (this.hBig / Math.tan(x)), 1],   // Q2
                [this.rSmall + this.hBig, this.hSmall + (4/3) * this.hBig, this.lBig - (this.hBig / Math.tan(x)), 1],    // Q3
                [this.rSmall, this.hSmall, this.lBig, 1] // Q4
            ],  // U = 2 -> P2
            [
                [-this.rSmall, this.hSmall, 0, 1],    // Q1
                [-this.rSmall - this.hBig, this.hSmall + (4/3) * this.hBig , (this.hBig / Math.tan(x)), 1],   // Q2
                [-this.rSmall - this.hBig, this.hSmall + (4/3) * this.hBig, this.lBig - (this.hBig / Math.tan(x)), 1],    // Q3
                [-this.rSmall, this.hSmall, this.lBig, 1] // Q4
            ],  // U = 3 -> P1
            [
                [-this.rSmall, 0.0, 0, 1],    // Q1
                [-this.rSmall - this.hBig, 0.0, (this.hBig / Math.tan(x)), 1],   // Q2
                [-this.rSmall - this.hBig, 0.0, this.lBig - (this.hBig / Math.tan(x)), 1],    // Q3
                [-this.rSmall, 0.0, this.lBig, 1] // Q4
            ] 
 
        ];
        
        let nurbsSurface = new CGFnurbsSurface(3, 3, controlPoints);
        this.nSurface = new CGFnurbsObject(this.scene, this.stacks, this.slices, nurbsSurface); 
    }

    display() {
        this.nSurface.display();
        this.scene.pushMatrix();

        this.scene.rotate(Math.PI, 0.0, 0.0, 1.0);
        this.nSurface.display();

        this.scene.popMatrix();

    }

    updateTexCoords(s, t) {
        
    }
}