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

		this.elapsedTime = 0;

		this.auxBoard.purplePieces[2][13].isMoving = true;
		this.auxBoard.purplePieces[2][13].move(0, 0);
		// this.auxBoard.purplePieces[2][13].move(0.7165063509461096 , -4.763139720814412);
		/* this.entered = false; */
		// console.log("POSITION:");
		// console.log(this.auxBoard.purplePieces[2][13].position);
	}

	update(currentTime) {
		//console.log(this.elapsedTime);
		/* 		if (this.elapsedTime > 3 && !this.entered) {
			this.auxBoard.purplePieces[2][13].isMoving = true;
			this.auxBoard.purplePieces[2][13].isInAuxBoard = false;
			this.entered = true;
		} */
		if (this.auxBoard.purplePieces[2][13].animation != null) {
			this.auxBoard.purplePieces[2][13].update(currentTime);

			if (this.auxBoard.purplePieces[2][13].animation == null) {
				this.auxBoard.purplePieces[2][13].isMoving = false;
				return;
			}

			if (this.auxBoard.purplePieces[2][13].animation.animationEnded) {
				this.auxBoard.purplePieces[2][13].isMoving = false;
			}
		}
		this.elapsedTime += currentTime;
	}

	logPicking() {
		if (this.scene.pickMode == false) {
			if (
				this.scene.pickResults != null &&
				this.scene.pickResults.length > 0
			) {
				for (var i = 0; i < this.scene.pickResults.length; i++) {
					this.lastPicked = this.pickedNow;
					this.pickedNow = this.scene.pickResults[i][0];
					if (this.pickedNow instanceof MyTile) {
						this.pickedNow.isPicked = true;
						console.log(
							"The picked object is in the line " +
								this.pickedNow.line +
								" and diagonal " +
								this.pickedNow.diagonal
						);
					}
					if (this.lastPicked != null)
						this.lastPicked.isPicked = false;
				}
			}
			this.scene.pickResults.splice(0, this.scene.pickResults.length);
		}
	}

	display() {
		//this.theme.display();

		// PICKING TESTING
		this.logPicking();
		this.scene.clearPickRegistration();

		this.scene.pushMatrix();

		// this.scene.translate(4.83, 0.8, 4.0);
		// this.scene.scale(0.5, 1.0, 0.5);
		// this.scene.rotate(-Math.PI / 2, 1, 0, 0);
		this.gameBoard.display();
		this.scene.clearPickRegistration();

		this.auxBoard.display();

		this.scene.popMatrix();
	}
}
