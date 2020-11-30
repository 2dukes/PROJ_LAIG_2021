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
    }
    
    update(time) {
        //this.animator.update(time);
    }

    logPicking() {

		if (this.scene.pickMode == false) {
			if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {

				for (var i = 0; i < this.scene.pickResults.length; i++) {
                    this.lastPicked = this.pickedNow;
                    this.pickedNow = this.scene.pickResults[i][0];
                    if (this.pickedNow instanceof MyTile) {
                        this.pickedNow.isPicked = true;
                        if (this.lastPicked != null)
                            this.lastPicked.isPicked = false;
                        console.log("The picked object is in the line " + this.pickedNow.line + " and diagonal " + this.pickedNow.diagonal);
                    }
                    else if (this.pickedNow) {
                        var customId = this.scene.pickResults[i][1];
						console.log("Picked object: " + this.pickedNow + ", with pick id " + customId);
                    }
				}
				this.scene.pickResults.splice(0, this.scene.pickResults.length);
			}
		}
	}

    display() {

        //this.theme.display();

        // PICKING TESTING
        this.logPicking();
		this.scene.clearPickRegistration();

        this.scene.pushMatrix();

        this.scene.translate(4.83,0.8,4.0);
        this.scene.scale(0.5,1,0.5);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.gameBoard.display();

        this.scene.popMatrix();


        //this.animator.display();
    }
}