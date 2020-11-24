class MyPatch extends CGFobject {
    constructor(scene, nPointsU, nPointsV, nPartsU, nPartsV, controlPoints) {
        super(scene);

        this.nPointsU = nPointsU;
        this.nPointsV = nPointsV;
        this.nPartsU = nPartsU;
        this.nPartsV = nPartsV;
        this.controlPoints = controlPoints;

        this.init();

        this.initBuffers();
    }
    
    init() {

        let controlPoints = [];

        for (let i = 0; i < this.nPointsU; i++) {
            let uList = [];
            for (let j = 0; j < this.nPointsV; j++) {
                uList.push(this.controlPoints[i * this.nPointsV + j]);
            }
            controlPoints.push(uList);
        }

        let nurbsSurface = new CGFnurbsSurface(this.nPointsU - 1, this.nPointsV - 1, controlPoints);
        this.nSurface = new CGFnurbsObject(this.scene, this.nPartsU, this.nPartsV, nurbsSurface); 
    }

    display() {

        this.nSurface.display();
    }

    updateTexCoords(s, t) {
        
    }
}