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
		this.winnerNum = null;

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

		if (this.totalSeconds > this.timeout) {
			this.gameBoard.currentPlayer = this.gameBoard.currentPlayer % 2 + 1; 
			this.scene.performCameraAnimation(this.scene.playerCameras[this.gameBoard.currentPlayer], 1.5);
			this.resetTime(1);
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
				if(this.checkGameWinner(this.winnerNum)) {
					this.scene.performCameraAnimation('menuCamera', 1.5);
				} else
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

	async gameMove() {
		if (this.movingPiece != null && this.promiseComputer && this.promisePlayer) {
			let stringParamPlayer = this.gameBoard.formatFetchStringPlayer(this.pickedNow.line, this.pickedNow.diagonal, this.movingPiece.color);
			this.promisePlayer = false;
			let jsonResponse = await this.gameBoard.callPrologMove(stringParamPlayer);	
			this.winnerNum = jsonResponse.winner;

			this.movingPiece.move(this.pickedNow.x, this.pickedNow.y);
			this.resetTime();
			this.gameSequence.addMove(new MyPieceMove(this.scene, this.movingPiece, this.pickedNow.x, this.pickedNow.y, this.gameBoard.board, "player"));
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
		let stringParamBot = this.gameBoard.formatFetchStringComputer();
			this.promiseComputer = false;
			let jsonResponse = await this.gameBoard.callPrologMove(stringParamBot);
			this.winnerNum = jsonResponse.winner;

			this.movingPiece = this.auxBoard.getNextPiece(jsonResponse.playedColour);
			
			let tileCoords = this.gameBoard.getTileCoordinates(jsonResponse.playedRow, jsonResponse.playedDiagonal);

			if(tileCoords != null) {
				this.movingPiece.move(tileCoords[0], tileCoords[1]);
				this.resetTime();
				this.gameSequence.addMove(new MyPieceMove(this.scene, this.movingPiece, tileCoords[0], tileCoords[1], this.gameBoard.board, "computer"));
				this.promiseComputer = true;
			} else 
				console.log('Incorrect line or diagonal in computer move!');
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
				this.movingPiece.isInAuxBoard = true;
				this.movingPiece.isSelected = false;
				this.gameBoard.deselectTile(lastGameSequence.finalX, lastGameSequence.finalY);
			}
			
		}
	}

	checkGameWinner(gameWinner) {
		if(gameWinner > 0) {
			this.resetBoard();
			this.resetVariables()
		}
	}

	resetBoard() {
		let lastGameSequence;
		do {
			lastGameSequence = this.gameSequence.undo();
			if(lastGameSequence != null) {
				this.auxPiece = lastGameSequence.pieceToMove;
				this.gameSequence.pop();

				let nextStackPosition = this.auxBoard.getNextStackPosition(this.movingPiece.color, this.movingPiece.numStack);
				this.auxPiece.position = nextStackPosition;
				this.auxPiece.isInAuxBoard = true;
				this.auxPiece.isSelected = false;
			}
		} while(lastGameSequence != null);
	}

	resetVariables() {
		this.gameBoard.board = this.emptyBoard;
		this.sceneInited = false;
		this.scene.menu.choseAll = false;

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

						if (this.pickedNow.optionName == "undo" && this.finishedUndo) {
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
		
		this.scene.translate(5.5, 1.1, 7);
		this.scene.rotate(Math.PI, 0, 1, 0);
		this.undoButton.display();
		this.scene.clearPickRegistration();

		this.scene.popMatrix();

		//----------------MARCADOR------------------------------
		
		this.scene.pushMatrix();

		this.scene.translate(4.9, 1.7, 7);
		this.scene.rotate(Math.PI, 0, 1, 0);
		this.marcador.display(this.gameBoard.playerPoints[0].toString() + "-" +  this.gameBoard.playerPoints[1].toString());

		this.scene.popMatrix();

		//----------------TEMPO DE JOGO------------------------------
		
		this.scene.pushMatrix();

		this.scene.translate(4.4, 2.5, 7);
		this.scene.rotate(Math.PI, 0, 1, 0);
		this.timeSprite.display(this.timeStr);

		this.scene.popMatrix();
	}
}
