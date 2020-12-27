class MyPiece {
	constructor(scene, radius, appearance, position, color, selectedPieceAp, numStack) {
		this.scene = scene;
		this.radius = radius;
		this.isSelected = false;
		this.isMoving = false;
		this.isInAuxBoard = true;
		this.position = position;
		this.appearance = appearance;
		this.color = color;
		this.selectedPieceAp = selectedPieceAp;
		this.numStack = numStack;

		this.tile = new MyCylinder(
			this.scene,
			this.radius,
			this.radius,
			0.05,
			6,
			1
		);	

		this.animation = null;

	}

	move(finalX, finalZ, finalY) {

		let	xOffset = finalX - this.position[0];
		let	zOffset = finalZ - this.position[1];
		let yOffset = -this.position[2] + 0.05;
		if (finalY !== undefined) {
			yOffset = finalY - this.position[2];
		}

		let keyFrames = [
			new Transformation(
				0,
				[0, 0, 0],
				[0, 0, 0],
				[1, 1, 1]
			),
			new Transformation(
				0.25,
				[0, 0, 0.75],
				[0, 0, 0],
				[1, 1, 1]
			),
			new Transformation(0.3, [xOffset, zOffset, 0.75], [0, 0, 0], [1, 1, 1]),
			new Transformation(
				0.5,
				[xOffset, zOffset, yOffset],
				[0, 0, 0],
				[1, 1, 1]
			)
		];
		this.animation = new KeyFrameAnimation(this.scene, keyFrames, "");
		
		this.isMoving = true;

		this.isInAuxBoard = false;
		if (finalY !== undefined) this.isInAuxBoard = true;
	}

	updateFinalCoordinates() { // Update animation final coordinates
		this.position[0] = this.position[0] + this.animation.keyFrames[3].translation[0];
		this.position[1] = this.position[1] + this.animation.keyFrames[3].translation[1];
		this.position[2] = this.position[2] + this.animation.keyFrames[3].translation[2];
	}


	update(currentTime) {
		if (this.isMoving && this.animation != null) {
			this.animation.update(currentTime);
		}
	}

	display() {
		this.scene.pushMatrix();

		if (this.animation != null) this.animation.apply();

		this.isSelected ? this.selectedPieceAp.apply() : this.appearance.apply();

		this.scene.translate(this.position[0], this.position[1], this.position[2]);
		this.tile.display();

		this.scene.popMatrix();
	}
}
