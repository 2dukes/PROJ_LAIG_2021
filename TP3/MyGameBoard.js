class MyGameBoard {
    constructor() {
        let diagonalLineMap = new Map();
        let diagonalStartingCoordinatesMap = new Map();
        this.initializeDiagonalLineMap(diagonalLineMap);
        this.initializeDiagonalCoordinates(diagonalStartingCoordinatesMap);
    }

    initializeDiagonalLineMap(diagonalLineMap) {
        // NDiagonal -> NLinha
        let startingLine = [1, 1, 2, 3, 4, 5, 7, 8, 10, 12, 13, 16, 19];
        startingLine.forEach(function(value, index) {
            diagonalLineMap.set(index + 1, value);
        });
    }

    initializeDiagonalCoordinates(diagonalStartingCoordinatesMap) {
        // Saber altura e base no top
    }
}

/*
    Map(DiagonalNumber -> NumLinha, ...);
    Map(DiagonalNumber -> StartingCoordinates (X, Y,Z));
*/