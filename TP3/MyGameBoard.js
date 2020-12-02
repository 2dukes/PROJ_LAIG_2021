class MyGameBoard {
    constructor(scene, tileRadius) {
        this.scene = scene;
        this.tileRadius = tileRadius;
        let diagonalLineMap = this.initializeDiagonalLineMap();
        let diagonalStartingCoordinatesMap = this.initializeDiagonalCoordinates();
        this.initializeTextures();
        this.initializeTiles(diagonalLineMap, diagonalStartingCoordinatesMap);
        
        this.borderColors = new BorderColor(this.scene);
    }

    initializeTiles(diagonalLineMap, diagonalStartingCoordinatesMap) {
        // Length of each Diagonal
        let lineLength = [5, 8, 9, 10, 11, 12, 11, 12, 11, 10, 9, 8, 5];
        this.tiles = [];

        for(let index = 0; index < lineLength.length; index++) {
            let value = lineLength[index];
            let startingLine = diagonalLineMap.get(index + 1);
            let diagonalStartPosition = diagonalStartingCoordinatesMap.get(index + 1);
            for(let i = 0; i < value; i++) 
                this.tiles.push(new MyTile(this, this.scene, this.tileRadius, i + startingLine, index + 1, diagonalStartPosition, startingLine, this.otherAppearance, this.defaultAp));
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

        let auxiliarRadius = (this.tileRadius * Math.sqrt(3)) / 2;
        let auxDiag2 = 2 * this.tileRadius + auxiliarRadius;
        let auxOffset = this.tileRadius + (auxiliarRadius / 2);

        // NDiagonal -> Starting Coordinates
        let startingCoords = [
            { x: 0, y: 0 },                                                    // 1
            { x: auxDiag2, y: 0 },                                             // 2
            { x: auxDiag2 + auxOffset, y: -auxiliarRadius },                   // 3
            { x: auxDiag2 + 2 * auxOffset, y: -2 * auxiliarRadius },           // 4
            { x: auxDiag2 + 3 * auxOffset, y: -3 * auxiliarRadius },           // 5
            { x: auxDiag2 + 4 * auxOffset, y: -4 * auxiliarRadius },           // 6
            { x: auxDiag2 + 4 * auxOffset, y: -6 * auxiliarRadius },           // 7
            { x: auxDiag2 + 5 * auxOffset, y: -7 * auxiliarRadius },           // 8
            { x: auxDiag2 + 5 * auxOffset, y: -9 * auxiliarRadius },           // 9
            { x: auxDiag2 + 5 * auxOffset, y: -11 * auxiliarRadius },          // 10
            { x: auxDiag2 + 5 * auxOffset, y: -13 * auxiliarRadius },          // 11
            { x: auxDiag2 + 5 * auxOffset, y: -15 * auxiliarRadius },          // 12
            { x: auxDiag2 + 4 * auxOffset, y: -18 * auxiliarRadius },          // 13
        ];

        startingCoords.forEach(function(value, index) {
            diagonalStartingCoordinatesMap.set(index + 1, { x: value.x, y: value.y });
        });
        console.log(diagonalStartingCoordinatesMap);
        return diagonalStartingCoordinatesMap;
    }

    display() {

        

        for (let i = 0; i < this.tiles.length; i++) {
            this.scene.registerForPick(i + 1,this.tiles[i]);
            this.tiles[i].display();
        }
        this.borderColors.display();

        

    }
}

/*
    Map(DiagonalNumber -> NumLinha, ...);
    Map(DiagonalNumber -> StartingCoordinates (X, Y,Z));
*/