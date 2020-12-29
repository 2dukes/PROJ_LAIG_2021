class MyTile {
    constructor(gameBoard, scene, radius, line, diagonal, diagonalSP, diagonalStartingLine, appearance1, appearance2) {
        this.gameBoard = gameBoard;
        this.scene = scene;
        this.line = line;
        this.diagonal = diagonal;
        this.radius = radius;
        this.piece = null;
        this.isSelected = false;
        this.tile = new MyCylinder(this.scene, this.radius, this.radius, 0.05, 6, 1);

        this.appearance1 = appearance1;
        this.appearance2 = appearance2;

        this.hasPiece = false;
        
        this.getCoords(diagonalSP, diagonalStartingLine);
    }

    getCoords(diagonalSP, diagonalStartingLine) {
        let numberOfTransfs = this.line - diagonalStartingLine;
        let auxiliarRadius = (this.radius * Math.sqrt(3)) / 2;

        this.xOffset = diagonalSP.x - numberOfTransfs * (this.radius + (auxiliarRadius / 2));
        this.yOffset = diagonalSP.y - numberOfTransfs * auxiliarRadius;
        this.x = this.xOffset;
        this.y = this.yOffset;
    }

    display() {   
        this.scene.pushMatrix();

        this.isSelected ? this.appearance1.apply() : this.appearance2.apply();

        this.scene.translate(this.xOffset, this.yOffset, 0);
        this.tile.display();

        this.scene.popMatrix();
        
    }
}