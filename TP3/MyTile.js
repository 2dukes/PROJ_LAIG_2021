class MyTile {
    constructor(gameBoard, radius, line, diagonal, diagonalSP, diagonalStartingLine) {
        this.gameBoard = gameBoard;
        this.line = line;
        this.diagonal = diagonal;
        this.radius = radius;
        this.diagonalSP = diagonalSP;
        this.diagonalStartingLine = diagonalStartingLine;
        this.piece = null;
    }

    display() {
        // line - diagonalStartingLine -> gives the number of transformations we have to do.
    }

    // <gameboard x1="" y2="" x2="" y2="">
    //     <tiles radius="" />
    // </gameboard>

    // <piece type="cylinder" colour="green/orange/purple" />

}

