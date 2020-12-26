class MyGameBoard {
    constructor(scene, tileRadius) {
        this.scene = scene;
        this.tileRadius = tileRadius;
        let diagonalLineMap = this.initializeDiagonalLineMap();
        let diagonalStartingCoordinatesMap = this.initializeDiagonalCoordinates();
        this.initializeTextures();
        this.initializeTiles(diagonalLineMap, diagonalStartingCoordinatesMap);
        
        this.borderColors = new BorderColor(this.scene);

        this.pickEnabled = false;
        let empty = 'empty';
        this.board = [
        [                                         empty,    empty],                            
        [                                     empty,   empty,   empty],                         
        [                                empty,    empty,   empty,  empty],                    
        [                           empty,    empty,    empty,   empty,   empty],              
        [                      empty,    empty,    empty,   empty,   empty,   empty],          
        [                          empty,     empty,   empty,   empty,    empty],              
        [                      empty,    empty,    empty,   empty,   empty,   empty],           
        [                 empty,   empty,     empty,   empty,   empty,    empty,   empty],     
        [                      empty,    empty,    empty,   empty,  empty,   empty],           
        [                 empty,   empty,     empty,    empty,   empty,    empty,   empty],      
        [                      empty,    empty,    empty,   empty,  empty,   empty],           
        [                 empty,   empty,     empty,   empty,     empty,    empty,   empty],      
        [                      empty,    empty,    empty,   empty,  empty,   empty],           
        [                 empty,   empty,     empty,   empty,     empty,    empty,   empty],      
        [                      empty,    empty,    empty,   empty,   empty,   empty],           
        [                 empty,   empty,     empty,   empty,     empty,    empty,   empty],      
        [                      empty,    empty,    empty,   empty,   empty,   empty],           
        [                           empty,    empty,   empty,    empty,   empty],               
        [                      empty,    empty,    empty,   empty,   empty,   empty],           
        [                           empty,    empty,   empty,   empty,   empty],                
        [                                empty,    empty,   empty,   empty],                    
        [                                     empty,   empty,   empty],                         
        [                                          empty,   empty]                              
        ];

        this.players = {
            FIRSTPLAYER: 1,
            SECONDPLAYER: 2
        };

        this.gameLevel = 'greedy';
        this.player1Score = ['FALSE', 'FALSE', 'FALSE']; // Purple | Orange | Green
        this.player2Score = ['FALSE', 'FALSE', 'FALSE']; // Purple | Orange | Green
        this.currentPlayer = 1;
        this.winner = 0; // 0 = No Winner | 1 or 2 is the player number winner
    }

    getTileCoordinates(line, diagonal) {
        for (let i = 0; i < this.tiles.length; i++) {
            if (this.tiles[i].diagonal == diagonal && this.tiles[i].line == line) 
                return [this.tiles[i].x, this.tiles[i].y];
        }

        return null;
    }

    deselectTile(x, y) {
        for (let i = 0; i < this.tiles.length; i++) {
            if (this.tiles[i].x == x && this.tiles[i].y == y) {
                this.tiles[i].isSelected = false;
                return;
            }
        }
    }

    formatFetchString(predicateName) {
        let boardString = JSON.stringify(this.board);
		
        boardString = boardString.replace (/"/g,''); 
        let stringParam = `${predicateName}(${boardString}-(`;
        this.player1Score.forEach((playerColour) => {
			stringParam += `'${playerColour}'-`;
		});
		this.player2Score.forEach((playerColour) => {
			stringParam += `'${playerColour}'-`;
        });
        stringParam = stringParam.slice(0, stringParam.length - 1);

        return stringParam;
    }

    formatFetchStringPlayer(finalLine, finalDiagonal, color) {
        let stringParam = this.formatFetchString('userMove');
		stringParam += `),selectedMove(${finalLine}-${finalDiagonal}-${color}),${this.currentPlayer})`;
        
		return stringParam;
    }

    formatFetchStringComputer() {
        let stringParam = this.formatFetchString('computerMove');
        stringParam += `),${this.currentPlayer},${this.gameLevel})`;

        return stringParam;
    }

    async callPrologMove(stringParam) {
        let response = await fetch(`http://localhost:8080/${stringParam}`, { 
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        
        let jsonResponse = await response.json();
        if(jsonResponse.success) 
            this.parseResponse(jsonResponse);
        
        return jsonResponse;
    }


    parsePlayerColours(playerColours, playerNumber) {
        if(playerNumber == this.players.FIRSTPLAYER) {
            this.player1Score = [
                playerColours.purple.toString().toUpperCase(),
                playerColours.orange.toString().toUpperCase(),
                playerColours.green.toString().toUpperCase()
            ];
        }
        else {
            this.player2Score = [
                playerColours.purple.toString().toUpperCase(),
                playerColours.orange.toString().toUpperCase(),
                playerColours.green.toString().toUpperCase()
            ];
        }
    }

    parseResponse(jsonResponse) {
        if(jsonResponse.winner != 0) 
            alert(`PLAYER ${jsonResponse.winner} won!`);
        
        this.board = jsonResponse.board;
        this.currentPlayer = jsonResponse.nextPlayer;
        this.winner = jsonResponse.winner;
        this.parsePlayerColours(jsonResponse.currentPlayerColours, jsonResponse.currentPlayer);

    }

    initializeTextures() {
        this.defaultTileAppearance=new CGFappearance(this.scene);
        this.defaultTileAppearance.setAmbient(0.5,0.5,0.5,1); // Ambient RGB
        this.defaultTileAppearance.setDiffuse(0.5,0.5,0.5,1); // Diffuse RGB
        this.defaultTileAppearance.setSpecular(0.5,0.5,0.5,1); // Specular RGB
        this.defaultTileAppearance.setEmission(0.5,0.5,0.5,1); // Emissive RGB
        this.defaultTileAppearance.setShininess(1);

        this.texture1 = new CGFtexture(this.scene, "./scenes/images/tiles/empty_tile.png");
        this.defaultTileAppearance.setTexture(this.texture1);
        this.defaultTileAppearance.setTextureWrap('REPEAT', 'REPEAT');
        this.defaultTileAppearance.apply();

        this.selectedTileAppearance=new CGFappearance(this.scene);
        this.selectedTileAppearance.setAmbient(0.5,0.5,0.5,1); // Ambient RGB
        this.selectedTileAppearance.setDiffuse(0.5,0.5,0.5,1); // Diffuse RGB
        this.selectedTileAppearance.setSpecular(0.5,0.5,0.5,1); // Specular RGB
        this.selectedTileAppearance.setEmission(0.5,0.5,0.5,1); // Emissive RGB/ Emissive RGB
        this.selectedTileAppearance.setShininess(10); 

        this.texture2 = new CGFtexture(this.scene, "./scenes/images/tiles/selected_tile.png");
        this.selectedTileAppearance.setTexture(this.texture2);
        this.selectedTileAppearance.setTextureWrap('REPEAT', 'REPEAT');
        this.selectedTileAppearance.apply();
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
                this.tiles.push(new MyTile(this, this.scene, this.tileRadius, i + startingLine, index + 1, diagonalStartPosition, startingLine, this.selectedTileAppearance, this.defaultTileAppearance));
        }

    }

    initializeDiagonalLineMap() {
        let diagonalLineMap = new Map();

        // NDiagonal -> NLinha it Starts
        let startingLine = [1, 1, 2, 3, 4, 5, 7, 8, 10, 12, 14, 16, 19];
        startingLine.forEach(function(value, index) {
            diagonalLineMap.set(index + 1, value);
        });

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

        return diagonalStartingCoordinatesMap;
    }

    display() {

        for (let i = 0; i < this.tiles.length; i++) {

            if (this.pickEnabled)
                this.scene.registerForPick(i + 1,this.tiles[i]);
            
            this.tiles[i].display();
        }
        this.borderColors.display();

    }
}
