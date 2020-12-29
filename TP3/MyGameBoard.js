class MyGameBoard {
    constructor(scene, tileRadius) {
        this.scene = scene;
        this.tileRadius = tileRadius;

        this.initBoard();
    }

    initBoard() {
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
        this.playerPoints = [0, 0];
        
        this.player1Score = ['FALSE', 'FALSE', 'FALSE']; // Purple | Orange | Green
        this.player2Score = ['FALSE', 'FALSE', 'FALSE']; // Purple | Orange | Green
        this.currentPlayer = 1;
        this.winner = 0; // 0 = No Winner | 1 or 2 is the player number winner

        this.colors_player_1 = new MyRectangle(this.scene, 0, 0, 1.5, 0.4);
        this.colors_player_2 = new MyRectangle(this.scene, 0, 0, 1.5, 0.4);

        this.initScorePieces();
    }

    initScorePieces() {
        this.purplePieceAp = new CGFappearance(this.scene);
		this.purplePieceAp.setAmbient(0.302, 0, 0.302, 1); // Ambient RGB
		this.purplePieceAp.setDiffuse(0.302, 0, 0.302, 1); // Diffuse RGB
		this.purplePieceAp.setSpecular(0.0, 0, 0.0, 1); // Specular RGB
		this.purplePieceAp.setEmission(0.1, 0, 0.1, 1); // Emissive RGB
		this.purplePieceAp.setShininess(1);

		this.texture1 = new CGFtexture(this.scene,"./scenes/images/tiles/purple_tile.png");
		this.purplePieceAp.setTexture(this.texture1);
		this.purplePieceAp.setTextureWrap("REPEAT", "REPEAT");
		this.purplePieceAp.apply();

		this.greenPieceAp = new CGFappearance(this.scene);
		this.greenPieceAp.setAmbient(0, 0.502, 0, 1); // Ambient RGB
		this.greenPieceAp.setDiffuse(0, 0.502, 0, 1); // Diffuse RGB
		this.greenPieceAp.setSpecular(0, 0, 0, 1); // Specular RGB
		this.greenPieceAp.setEmission(0, 0, 0, 1); // Emissive RGB
		this.greenPieceAp.setShininess(1);

		this.texture2 = new CGFtexture(this.scene,"./scenes/images/tiles/green_tile.png");
		this.greenPieceAp.setTexture(this.texture2);
		this.greenPieceAp.setTextureWrap("REPEAT", "REPEAT");
		this.greenPieceAp.apply();

		this.orangePieceAp = new CGFappearance(this.scene);
		this.orangePieceAp.setAmbient(1, 0.4, 0, 1); // Ambient RGB
		this.orangePieceAp.setDiffuse(1, 0.4, 0, 1); // Diffuse RGB
		this.orangePieceAp.setSpecular(0, 0, 0, 1); // Specular RGB
		this.orangePieceAp.setEmission(0, 0, 0, 1); // Emissive RGB
		this.orangePieceAp.setShininess(1);

		this.texture3 = new CGFtexture(this.scene,"./scenes/images/tiles/orange_tile.png");
		this.orangePieceAp.setTexture(this.texture3);
		this.orangePieceAp.setTextureWrap("REPEAT", "REPEAT");
        this.orangePieceAp.apply();
        
        this.purpleScorePiece = new MyPiece(
            this.scene, 
            0.15, 
            this.purplePieceAp,
            [0,0,0],
            "purple",
            null,
            -1
        );
        this.greenScorePiece = new MyPiece(
            this.scene, 
            0.15, 
            this.greenPieceAp,
            [0,0,0],
            "green",
            null,
            -1
        );
        this.orangeScorePiece = new MyPiece(
            this.scene, 
            0.15, 
            this.orangePieceAp,
            [0,0,0],
            "orange",
            null,
            -1
        );
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
        if(jsonResponse.winner != 0) {
            this.playerPoints[jsonResponse.winner]++;
            console.log(`PLAYER ${jsonResponse.winner} won!`);
            document.querySelector('#messages').style.display = "block";
            document.querySelector('#messages').innerHTML = `Player ${jsonResponse.winner} won!`;
        }
        
        this.board = jsonResponse.board;
        this.winner = jsonResponse.winner;
        this.parsePlayerColours(jsonResponse.currentPlayerColours, jsonResponse.currentPlayer);
        this.parsePlayerColours(jsonResponse.nextPlayerColours, jsonResponse.currentPlayer % 2 + 1);
        this.currentPlayer = jsonResponse.nextPlayer;
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
        this.selectedTileAppearance.setEmission(0.5,0.5,0.5,1); // Emissive RGB
        this.selectedTileAppearance.setShininess(10); 

        this.texture2 = new CGFtexture(this.scene, "./scenes/images/tiles/selected_tile.png");
        this.selectedTileAppearance.setTexture(this.texture2);
        this.selectedTileAppearance.setTextureWrap('REPEAT', 'REPEAT');
        this.selectedTileAppearance.apply();

        this.colors_player_1_ap = new CGFappearance(this.scene);
        this.colors_player_1_ap.setEmission(0.5,0.5,0.5,1);
        this.selectedTileAppearance.setShininess(10); 
        this.texture3 = new CGFtexture(this.scene, "./scenes/images/colors_player_1.png");
        this.colors_player_1_ap.setTexture(this.texture3);
        this.colors_player_1_ap.setTextureWrap('REPEAT', 'REPEAT');
        this.colors_player_1_ap.apply();

        this.colors_player_2_ap = new CGFappearance(this.scene);
        this.colors_player_2_ap.setEmission(0.5,0.5,0.5,1);
        this.colors_player_2_ap.setShininess(10); 
        this.texture4 = new CGFtexture(this.scene, "./scenes/images/colors_player_2.png");
        this.colors_player_2_ap.setTexture(this.texture4);
        this.colors_player_2_ap.setTextureWrap('REPEAT', 'REPEAT');
        this.colors_player_2_ap.apply();
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

        this.scene.pushMatrix();

        for (let i = 0; i < this.tiles.length; i++) {

            if (this.pickEnabled)
                this.scene.registerForPick(i + 1,this.tiles[i]);
            
            this.tiles[i].display();
        }
        this.scene.clearPickRegistration();
        this.borderColors.display();

        this.scene.popMatrix();

        //------------PLAYER COLORS-----------------

        this.scene.pushMatrix();
        this.colors_player_1_ap.apply();
        this.scene.translate(-2.7, -3.7, 0.05);
        this.scene.rotate(-Math.PI/3, 0, 0, 1);
        this.colors_player_1.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.colors_player_2_ap.apply();
        this.scene.translate(2.2, 0, 0.05);
        this.scene.rotate(-Math.PI/3, 0, 0, 1);
        this.colors_player_2.display();
        this.scene.popMatrix();

        //--------------PLAYER 1 PURPLE--------------

        if (this.player1Score[0] == "TRUE") {
            this.scene.pushMatrix();
            this.scene.translate(-2.5, -4.5, 0.05);
            this.purpleScorePiece.display();
            this.scene.popMatrix();
        }
        
        //--------------PLAYER 2 PURPLE--------------

        if (this.player2Score[0] == "TRUE") {
            this.scene.pushMatrix();
            this.scene.translate(3.1, -0.3, 0.05);
            this.purpleScorePiece.display();
            this.scene.popMatrix();
        }

        //--------------PLAYER 1 GREEN--------------

        if (this.player1Score[2] == "TRUE") {
            this.scene.pushMatrix();
            this.scene.translate(-2.75, -4, 0.05);
            this.greenScorePiece.display();
            this.scene.popMatrix();
        }

        //--------------PLAYER 2 GREEN--------------

        if (this.player2Score[2] == "TRUE") {
            this.scene.pushMatrix();
            this.scene.translate(3.3, -0.7, 0.05);
            this.greenScorePiece.display();
            this.scene.popMatrix();
        }
        
        //--------------PLAYER 1 ORANGE--------------

        if (this.player1Score[1] == "TRUE") {
            this.scene.pushMatrix();
            this.scene.translate(-2.25, -4.9, 0.05);
            this.orangeScorePiece.display();
            this.scene.popMatrix();
        }

        //--------------PLAYER 2 ORANGE--------------

        if (this.player2Score[1] == "TRUE") {
            this.scene.pushMatrix();
            this.scene.translate(2.9, 0.05, 0.05);
            this.orangeScorePiece.display();
            this.scene.popMatrix();
        }

    }
}
