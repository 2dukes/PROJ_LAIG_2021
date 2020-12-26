class MyGameOrchestrator {
	constructor(scene) {
		this.scene = scene;

		// this.gameSequence = new MyGameSequence(...);
		// this.animator = new MyAnimator(...);
		this.gameBoard = new MyGameBoard(this.scene, 0.25);
		// this.theme = new MySceneGraph(...);
		// this.prolog = new MyPrologInterface(...);

		this.pickedNow = null;
		this.lastPicked = null;
		this.finishedUndo = true;

		this.auxBoard = new MyAuxBoard(this.scene);

		this.movingPiece = null;

		this.gameSequence = new MyGameSequence(this.scene);

		this.gameMode = "PvB";

		this.promisePlayer = true;
		this.promiseComputer = true;

		if (this.gameMode == "BvB") {
			this.scene.setPickEnabled(false);
		}

		this.undoButton = new MyMenuButton(this.scene, 0, 0, 1, 0.3, "undo", 1500);

		this.undoAppearance = new CGFappearance(this.scene);
		this.undoTexture = new CGFtexture(this.scene, "./scenes/images/menu/undo.png");
		this.undoAppearance.setTexture(this.undoTexture);

	}

	update(currentTime) {

		if (this.movingPiece == null) return;

		if (this.movingPiece.animation != null) {
			this.movingPiece.update(currentTime);

			if (this.movingPiece.animation == null) {
				this.movingPiece.updateFinalCoordinates();
				this.movingPiece.isMoving = false;
				this.movingPiece.isSelected = false;
				this.movingPiece = null;
				return;
			}

			if (this.movingPiece.animation.animationEnded) {
				this.movingPiece.updateFinalCoordinates();
				this.movingPiece.isMoving = false;
				this.movingPiece.isSelected = false;
				this.movingPiece.animation = null;
				this.movingPiece = null;
			}
		
		}
	}

	async gameMove() {
		if (this.movingPiece != null && this.promiseComputer && this.promisePlayer) {
			let stringParamPlayer = this.gameBoard.formatFetchStringPlayer(this.pickedNow.line, this.pickedNow.diagonal, this.movingPiece.color);
			this.promisePlayer = false;
			await this.gameBoard.callPrologMove(stringParamPlayer);							
			this.movingPiece.move(this.pickedNow.x, this.pickedNow.y);
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
			
			this.movingPiece = this.auxBoard.getNextPiece(jsonResponse.playedColour);
			
			let tileCoords = this.gameBoard.getTileCoordinates(jsonResponse.playedRow, jsonResponse.playedDiagonal);

			if(tileCoords != null) {
				this.movingPiece.move(tileCoords[0], tileCoords[1]);
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
				let nextStackPosition = this.auxBoard.getNextStackPosition(this.movingPiece.color);
				
				this.movingPiece.move(nextStackPosition[0], nextStackPosition[1], nextStackPosition[2]);
				this.gameBoard.board = this.gameSequence.getPreviousBoard();
				this.movingPiece.isInAuxBoard = true;
				this.movingPiece.isSelected = false;
				this.gameBoard.deselectTile(lastGameSequence.finalX, lastGameSequence.finalY);
			}
			
		}
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
					}

					if (this.pickedNow instanceof MyMenuButton) {

						if (this.pickedNow.optionName == "undo" && this.finishedUndo) {
							this.finishedUndo = false;

							if (this.gameMode == "PvP") {
								this.undoMove();
							}
							else if (this.gameMode == "PvB") {

								let k = 0;
								while(k < 2) {
									if(this.movingPiece == null) {
										this.undoMove();
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
		//this.theme.display();

		

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
		else if (!this.movingPiece.isMoving) {
			this.gameBoard.pickEnabled = true;
			this.auxBoard.pickEnabled = true;
			this.scene.setPickEnabled(true);
		}


		this.gameMode == "BvB" ? this.computerVsComputerMove() : this.logPicking();
	

		this.scene.pushMatrix();

		this.scene.translate(4.83, 0.8, 4.0);
		this.scene.scale(0.5, 1.0, 0.5);
		this.scene.rotate(-Math.PI / 2, 1, 0, 0);
		this.gameBoard.display();
		this.scene.clearPickRegistration();

		this.auxBoard.display();
		this.scene.clearPickRegistration();

		this.scene.popMatrix();

		this.scene.pushMatrix();

        this.undoAppearance.apply();
		
		this.scene.translate(5, 1.1, 7);
		this.scene.rotate(Math.PI, 0, 1, 0);
		this.undoButton.display();
		this.scene.clearPickRegistration();

		this.scene.popMatrix();
	}
}
