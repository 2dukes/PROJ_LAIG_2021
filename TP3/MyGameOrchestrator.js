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

		this.auxBoard = new MyAuxBoard(this.scene);

		this.movingPiece = null;

		this.gameSequence = new MyGameSequence(this.scene);
		
	}

	update(currentTime) {

		if (this.movingPiece == null) return;

		if (this.movingPiece.animation != null) {
			this.movingPiece.update(currentTime);

			if (this.movingPiece.animation == null) {
				this.movingPiece.isMoving = false;
				this.movingPiece.isSelected = false;
				this.movingPiece = null;
				return;
			}

			if (this.movingPiece.animation.animationEnded) {
				this.movingPiece.isMoving = false;
				this.movingPiece.isSelected = false;
				this.movingPiece = null;
			}
		}
	}

	logPicking() {

		if (this.scene.pickMode == false) {
			if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
				for (var i = 0; i < this.scene.pickResults.length; i++) {
					this.lastPicked = this.pickedNow;
					this.pickedNow = this.scene.pickResults[i][0];
					if (this.pickedNow instanceof MyTile) {
						this.pickedNow.isPicked = true;
						
						if (this.movingPiece != null) {
							this.movingPiece.move(this.pickedNow.x, this.pickedNow.y);
							this.gameSequence.addMove(new MyPieceMove(this.scene, this.pickedNow, this.pickedNow.x, this.pickedNow.y));
						}

					}
					if (this.pickedNow instanceof MyPiece) { 
						this.movingPiece = this.pickedNow;
						this.movingPiece.isSelected = true;

						if (this.lastPicked != null) this.lastPicked.isSelected = false;
					}
			
					if (this.lastPicked != null) {
						this.lastPicked.isPicked = false;
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
		}
		else if (this.movingPiece.isMoving) {
			this.gameBoard.pickEnabled = false;
			this.auxBoard.pickEnabled = false;
		}
		else if (!this.movingPiece.isMoving) {
			this.gameBoard.pickEnabled = true;
			this.auxBoard.pickEnabled = true;
		}

		this.logPicking();

		this.scene.pushMatrix();

		this.scene.translate(4.83, 0.8, 4.0);
		this.scene.scale(0.5, 1.0, 0.5);
		this.scene.rotate(-Math.PI / 2, 1, 0, 0);
		this.gameBoard.display();
		this.scene.clearPickRegistration();

		this.auxBoard.display();
		this.scene.clearPickRegistration();

		this.scene.popMatrix();
	}
}
