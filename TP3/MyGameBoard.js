class MyGameBoard {
    constructor(scene, tileRadius) {
        this.scene = scene;
        this.tileRadius = tileRadius;
        let diagonalLineMap = this.initializeDiagonalLineMap();
        let diagonalStartingCoordinatesMap = this.initializeDiagonalCoordinates();
        this.initializeTiles(diagonalLineMap, diagonalStartingCoordinatesMap);
    }

    initializeTiles(diagonalLineMap, diagonalStartingCoordinatesMap) {
        // Length of each Diagonal
        let lineLength = [5, 8, 9, 10, 12, 12, 11, 12, 11, 10, 9, 8, 5];
        this.tiles = [];

        for(let index = 0; index < lineLength.length; index++) {
            let value = lineLength[index];

            let startingLine = diagonalLineMap.get(index + 1);
            let diagonalStartPosition = diagonalStartingCoordinatesMap.get(index + 1);
            for(let i = 0; i < value; i++) 
                this.tiles.push(new MyTile(this, this.tileRadius, i + startingLine, index + 1, diagonalStartPosition, startingLine));
        }

        console.log(this.tiles);
    }

    initializeDiagonalLineMap() {
        let diagonalLineMap = new Map();

        // NDiagonal -> NLinha it Starts
        let startingLine = [1, 1, 2, 3, 4, 5, 7, 8, 10, 12, 13, 16, 19];
        startingLine.forEach(function(value, index) {
            diagonalLineMap.set(index + 1, value);
        });
        console.log(diagonalLineMap);
        return diagonalLineMap;
    }

    initializeDiagonalCoordinates() {
        let diagonalStartingCoordinatesMap = new Map();

        // NDiagonal -> Starting Coordinates
        let startingCoords = [
            { x: 0, y: 0 },                                                // 1
            { x: 2 * this.tileRadius, y: 0 },                              // 2
            { x: 4 * this.tileRadius, y: -this.tileRadius },               // 3
            { x: 5 * this.tileRadius, y: -2 * this.tileRadius },           // 4
            { x: 6 * this.tileRadius, y: -3 * this.tileRadius },           // 5
            { x: 6 * this.tileRadius, y: -4 * this.tileRadius },           // 6
            { x: 7 * this.tileRadius, y: -6 * this.tileRadius },           // 7
            { x: 7 * this.tileRadius, y: -7 * this.tileRadius },           // 8
            { x: 7 * this.tileRadius, y: -9 * this.tileRadius },           // 9
            { x: 7 * this.tileRadius, y: -11 * this.tileRadius },          // 10
            { x: 7 * this.tileRadius, y: -13 * this.tileRadius },          // 11
            { x: 7 * this.tileRadius, y: -15 * this.tileRadius },          // 12
            { x: 6 * this.tileRadius, y: -18 * this.tileRadius },          // 13
        ];

        startingCoords.forEach(function(value, index) {
            diagonalStartingCoordinatesMap.set(index + 1, { x: value.x, y: value.y });
        });
        console.log(diagonalStartingCoordinatesMap);
        return diagonalStartingCoordinatesMap;
    }

    display() {
        
    }
}

/*
    Map(DiagonalNumber -> NumLinha, ...);
    Map(DiagonalNumber -> StartingCoordinates (X, Y,Z));
*/