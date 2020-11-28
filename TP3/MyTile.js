class MyTile {
    constructor(gameBoard, scene, radius, line, diagonal, diagonalSP, diagonalStartingLine) {
        this.gameBoard = gameBoard;
        this.scene = scene;
        this.line = line;
        this.diagonal = diagonal;
        this.radius = radius;
        this.piece = null;
        this.tile = new MyCylinder(this.scene, this.radius, this.radius, 0.1, 6, 6);
        
        this.getCoords(diagonalSP, diagonalStartingLine);
    }

    getCoords(diagonalSP, diagonalStartingLine) {
        let numberOfTransfs = this.line - diagonalStartingLine;
        let auxiliarRadius = (this.radius * Math.sqrt(3)) / 2;

        this.xOffset = diagonalSP.x - numberOfTransfs * (this.radius + (auxiliarRadius / 2));
        this.yOffset = diagonalSP.y - numberOfTransfs * auxiliarRadius;
        // console.log(this.xOffset, this.yOffset);
    }

    display() {
        // line - diagonalStartingLine -> gives the number of transformations we have to do.
        
        // if(this.diagonal < 4) {
            this.scene.pushMatrix();
            this.scene.translate(this.xOffset, this.yOffset, 0);
            this.tile.display();
            this.scene.popMatrix();
        // }
    }

    // <gameboard x1="" y2="" x2="" y2="">
    //     <tiles radius="" />
    // </gameboard>

    // <piece type="cylinder" colour="green/orange/purple" />

}

