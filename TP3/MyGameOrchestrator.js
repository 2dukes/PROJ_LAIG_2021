class MyGameOrchestrator {
	constructor(scene) {
		this.scene = scene;

		this.initGame();
	}

	initGame() {
		this.gameBoard = new MyGameBoard(this.scene, 0.25);
		this.auxBoard = new MyAuxBoard(this.scene);
		this.gameSequence = new MyGameSequence(this.scene);

		this.pickedNow = null;
		this.lastPicked = null;
		this.movingPiece = null;

		this.gameMode = "PvB";

		this.promisePlayer = true;
		this.promiseComputer = true;
		this.finishedUndo = true;
		this.winnerNum = 0;

		if (this.gameMode == "BvB") this.scene.setPickEnabled(false);
		
		this.undoButton = new MyMenuButton(this.scene, 0, 0, 1, 0.3, "undo", 1500);
		this.undoAppearance = new CGFappearance(this.scene);
		this.undoTexture = new CGFtexture(this.scene, "./scenes/images/menu/undo.png");
		this.undoAppearance.setTexture(this.undoTexture);

		this.marcador = new MySpriteText(this.scene, "0-0", 0.5);

		this.totalSeconds = 0;
		this.timeStr = "";

		this.timeSprite = new MySpriteText(this.scene, "0:00", 0.25);

		this.timeout = 10;

		this.backToMenuButton = new MyMenuButton(this.scene, 0, 0, 1, 0.3, "menu", 1501);
		this.backToMenuAppearance = new CGFappearance(this.scene);
		this.menuTexture = new CGFtexture(this.scene, "./scenes/images/menu/back_to_menu.png");
		this.backToMenuAppearance.setTexture(this.menuTexture);

		this.viewMovieButton = new MyMenuButton(this.scene, 0, 0, 1, 0.3, "movie", 1502);
		this.viewMovieAppearance = new CGFappearance(this.scene);
		this.movieTexture = new CGFtexture(this.scene, "./scenes/images/menu/movie.png");
		this.viewMovieAppearance.setTexture(this.movieTexture);
	}

	resetTime(delayTime) {
		if (delayTime == undefined)
			this.totalSeconds = -3; // demora 3 segundos para começar a contar o tempo da jogada, tempo para a animação acabar
		else
			this.totalSeconds = -delayTime;
	}

	computeTime(currentTime) {
		this.totalSeconds += currentTime;
		let minutes = Math.floor(Math.floor(this.totalSeconds) / 60);
		let seconds = Math.floor(this.totalSeconds) - minutes * 60;
		this.timeStr = "";
		this.timeStr += "" + minutes + ":" + (seconds < 10 ? "0" : "");
		this.timeStr += "" + seconds;
		if (this.totalSeconds < 0) this.timeStr = "0:00";

		if(this.winnerNum == 0) {
			if (this.gameMode !== "BvB" && this.totalSeconds > this.timeout) {
				if (this.gameMode == "PvP" || (this.gameMode == "PvB" && this.gameBoard.currentPlayer != 2)) {
					this.gameBoard.currentPlayer = this.gameBoard.currentPlayer % 2 + 1;
					this.scene.performCameraAnimation(this.scene.playerCameras[this.gameBoard.currentPlayer], 1.5);
					this.resetTime(1);
					if (this.gameMode == "PvB" && this.gameBoard.currentPlayer == 2) this.computerMove();
				
					
				}
			}
		}
	}

	update(currentTime) {

		this.computeTime(currentTime);

		if (this.movingPiece == null) return;

		if (this.movingPiece.animation != null) {
			this.movingPiece.update(currentTime);

			if (this.movingPiece.animation == null) {
				this.movingPiece.updateFinalCoordinates();
				this.movingPiece.isMoving = false;
				this.movingPiece.isSelected = false;
				this.movingPiece = null;

				this.scene.performCameraAnimation(this.scene.playerCameras[this.gameBoard.currentPlayer], 1.5);
				return;
			}

			if (this.movingPiece.animation.animationEnded) {
				this.movingPiece.updateFinalCoordinates();
				this.movingPiece.isMoving = false;
				this.movingPiece.isSelected = false;
				this.movingPiece.animation = null;
				this.movingPiece = null;

				this.scene.performCameraAnimation(this.scene.playerCameras[this.gameBoard.currentPlayer], 1.5);
			}
		
		}
	}

	getWinner() {
		let p1 = 0;
		let p2 = 0;
		this.gameBoard.player1Score.forEach((colourWon) => {
			p1 = colourWon == 'TRUE' ? p1 + 1 : p1; 
		});
		this.gameBoard.player2Score.forEach((colourWon) => {
			p2 = colourWon == 'TRUE' ? p2 + 1 : p2; 
		});

		if(p1 > 1)
			return 1;
		else
			return 2;
	}

	async makeGameMovie() {
		// Reset first for tests
		this.resetGame(false);
		// console.log(this.gameSequence.moves);
		for(let i = 0; i < this.gameSequence.moves.length ; i++) {
			let move = this.gameSequence.moves[i];
			this.movingPiece = this.auxBoard.getNextPiece(move.pieceColour);
			this.movingPiece.move(move.finalX, move.finalY);
			this.gameBoard.player1Score = move.player1Score;
			this.gameBoard.player2Score = move.player2Score;
			await new Promise((r) => setTimeout(r, 2500));
		}

		this.winnerNum = this.getWinner();
		console.log(`Winner: ${this.winnerNum}`);

		document.querySelector('#messages').style.display = "block";
        document.querySelector('#messages').innerHTML = `Player ${this.winnerNum} won!`;
		this.scene.performCameraAnimation('menuCamera', 1.5);
		this.resetGame(true);
	}

	async gameMove() {
		if (this.movingPiece != null && this.promiseComputer && this.promisePlayer && this.winnerNum == 0) {
			let stringParamPlayer = this.gameBoard.formatFetchStringPlayer(this.pickedNow.line, this.pickedNow.diagonal, this.movingPiece.color);
			this.promisePlayer = false;
			let jsonResponse = await this.gameBoard.callPrologMove(stringParamPlayer);	
			this.winnerNum = jsonResponse.winner;

			this.movingPiece.move(this.pickedNow.x, this.pickedNow.y);
			this.resetTime();
			this.gameSequence.addMove(new MyPieceMove(this.scene, this.movingPiece, this.movingPiece.color, this.pickedNow.x, this.pickedNow.y, this.gameBoard.board, "player", this.gameBoard.player1Score, this.gameBoard.player2Score));
			this.promisePlayer = true;
			
			if (this.gameMode == "PvB")
				this.computerMove();
			
		}
	}

	computerVsComputerMove() {
		if(this.movingPiece == null && this.gameMode == "BvB" && this.promiseComputer) 
			this.computerMove();
	}

	async computerMove() {
		if(this.winnerNum == 0) {
			let stringParamBot = this.gameBoard.formatFetchStringComputer();
			this.promiseComputer = false;
			let jsonResponse = await this.gameBoard.callPrologMove(stringParamBot);
			this.winnerNum = jsonResponse.winner;

			this.movingPiece = this.auxBoard.getNextPiece(jsonResponse.playedColour);
			
			let tileCoords = this.gameBoard.getTileCoordinates(jsonResponse.playedRow, jsonResponse.playedDiagonal);

			if(tileCoords != null) {
				this.movingPiece.move(tileCoords[0], tileCoords[1]);
				this.resetTime();
				this.gameSequence.addMove(new MyPieceMove(this.scene, this.movingPiece, this.movingPiece.color, tileCoords[0], tileCoords[1], this.gameBoard.board, "computer", this.gameBoard.player1Score, this.gameBoard.player2Score));
				this.promiseComputer = true;
			} else 
				console.log('Incorrect line or diagonal in computer move!');
		}
	}

	undoMove() {
		let lastGameSequence = this.gameSequence.undo();
								
		if(lastGameSequence != null) {
			this.movingPiece = lastGameSequence.pieceToMove;
			this.gameSequence.pop();

			if (this.movingPiece !== null && this.movingPiece !== undefined) {
				let nextStackPosition = this.auxBoard.getNextStackPosition(this.movingPiece.color, this.movingPiece.numStack);
				
				this.movingPiece.move(nextStackPosition[0], nextStackPosition[1], nextStackPosition[2]);
				this.resetTime();
				this.gameBoard.board = this.gameSequence.getPreviousBoard();
				this.player1Score = this.gameSequence.getPreviousPlayerScore(this.gameBoard.players.FIRSTPLAYER);
				this.player2Score = this.gameSequence.getPreviousPlayerScore(this.gameBoard.players.SECONDPLAYER);
				this.movingPiece.isInAuxBoard = true;
				this.movingPiece.isSelected = false;
				this.gameBoard.deselectTile(lastGameSequence.finalX, lastGameSequence.finalY);
			}
			
		}
	}

	checkGameWinner() {
		if(this.winnerNum > 0) {
			// this.resetBoard();
			console.log('A');
			this.resetGame(true);
			return true;
		} return false;
	}

	async resetGame(resetGameSequence) {
		if(resetGameSequence) {
			this.scene.menu = new MyMenu(this.scene);
			await new Promise((r) => setTimeout(r, 150));
			this.gameSequence = new MyGameSequence(this.scene);
		}
		this.resetTime();

		let playerPoints = this.gameBoard.playerPoints;

		this.gameBoard = new MyGameBoard(this.scene, 0.25);
		this.auxBoard = new MyAuxBoard(this.scene);
		

		this.gameBoard.playerPoints = playerPoints;

		this.pickedNow = null;
		this.lastPicked = null;
		this.movingPiece = null;

		this.promisePlayer = true;
		this.promiseComputer = true;
		this.finishedUndo = true;	
	}

	async logPicking() {

		if (this.scene.pickMode == false) {
			if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
				for (var i = 0; i < this.scene.pickResults.length; i++) {
					this.lastPicked = this.pickedNow;
					this.pickedNow = this.scene.pickResults[i][0];
					if (this.pickedNow instanceof MyTile) {
						this.pickedNow.isSelected = true;
						
						this.gameMove();
					}

					if (this.pickedNow instanceof MyPiece) { 					

						this.movingPiece = this.pickedNow;
						this.movingPiece.isSelected = true;

						if (this.lastPicked != null && (this.lastPicked instanceof MyPiece || this.lastPicked instanceof MyTile)) this.lastPicked.isSelected = false;
					
						if (!this.pickedNow.isSelected) {
							this.pickedNow = null;
							this.lastPicked = null;
							this.movingPiece = null;
						}
					}

					if (this.pickedNow instanceof MyMenuButton) {

						if (this.pickedNow.optionName == "undo" && this.finishedUndo && this.winnerNum == 0) {
							this.finishedUndo = false;

							if (this.gameMode == "PvP") {
								this.undoMove();
								this.gameBoard.currentPlayer = this.gameBoard.currentPlayer % 2 + 1; 
							}
							else if (this.gameMode == "PvB") {

								let k = 0;
								while(k < 2) {
									if(this.movingPiece == null) {
										this.undoMove();
										this.scene.performCameraAnimation(this.scene.playerCameras[this.gameBoard.currentPlayer], 1.5);
										k++;
									}
									await new Promise((r) => setTimeout(r, 2000));
								}
							}
							this.finishedUndo = true;			
						}

						else if (this.pickedNow.optionName == "menu") {
							this.scene.performCameraAnimation('menuCamera', 1.5);
							this.resetGame(true);
						}

						else if (this.pickedNow.optionName == "movie") {
							this.makeGameMovie();
						}

                    }
			
					if (this.lastPicked != null) {
						this.lastPicked.isSelected = false;
					}
				}
			}
			this.scene.pickResults.splice(0, this.scene.pickResults.length);
		}
	}

	display() {

		if(!this.scene.menu.choseAll) { // Only enters here at the end of the game
			return;
		}

		if(this.winnerNum > 0) {

			//----------------VIEW MOVIE---------------------------------
			this.scene.pushMatrix();

			this.viewMovieAppearance.apply();

			this.scene.translate(5.35, 2.5, 7);
			this.scene.rotate(Math.PI, 0, 1, 0);
			this.viewMovieButton.display();
			this.scene.clearPickRegistration();

			this.scene.popMatrix();
		}

		if (this.movingPiece == null) {
			this.gameBoard.pickEnabled = false;
			this.auxBoard.pickEnabled = true;
			this.scene.setPickEnabled(true);
		}
		else if (this.movingPiece.isMoving) {
			this.gameBoard.pickEnabled = false;
			this.auxBoard.pickEnabled = false;
			this.scene.setPickEnabled(false);
		}
		else {
			this.gameBoard.pickEnabled = true;
			this.auxBoard.pickEnabled = true;
			this.scene.setPickEnabled(true);
		}

		this.gameMode == "BvB" ? this.computerVsComputerMove() : this.logPicking();
		
		//-----------------Board and Aux Board--------------------

		this.scene.pushMatrix();

		this.scene.translate(4.83, 0.8, 4.0);
		this.scene.scale(0.5, 1.0, 0.5);
		this.scene.rotate(-Math.PI / 2, 1, 0, 0);
		this.gameBoard.display();
		this.scene.clearPickRegistration();

		this.auxBoard.display();
		this.scene.clearPickRegistration();

		this.scene.popMatrix();

		//------------------UNDO---------------------------------

		this.scene.pushMatrix();

        this.undoAppearance.apply();
		
		this.scene.translate(5.5, 0.5, 7);
		this.scene.rotate(Math.PI, 0, 1, 0);
		this.undoButton.display();
		this.scene.clearPickRegistration();

		this.scene.popMatrix();

		//----------------MARCADOR------------------------------
		
		this.scene.pushMatrix();

		this.scene.translate(4.9, 0.9, 7);
		this.scene.rotate(Math.PI, 0, 1, 0);
		this.marcador.display(this.gameBoard.playerPoints[0].toString() + "-" +  this.gameBoard.playerPoints[1].toString());

		this.scene.popMatrix();

		//----------------TEMPO DE JOGO------------------------------
		
		this.scene.pushMatrix();

		this.scene.translate(4.4, 1.5, 7);
		this.scene.rotate(Math.PI, 0, 1, 0);
		this.timeSprite.display(this.timeStr);

		this.scene.popMatrix();

		//----------------BACK TO MENU-------------------------------
		
		this.scene.pushMatrix();

		this.backToMenuAppearance.apply();

		this.scene.translate(5.35, 2, 7);
		this.scene.rotate(Math.PI, 0, 1, 0);
		this.backToMenuButton.display();
		this.scene.clearPickRegistration();

		this.scene.popMatrix();
	}
}
