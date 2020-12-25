class MyPiece {
	constructor(scene, radius, appearance, position, color) {
		this.scene = scene;
		this.radius = radius;
		this.isSelected = false;
		this.isMoving = false;
		this.isInAuxBoard = true;
		this.position = position;

		this.tile = new MyCylinder(
			this.scene,
			this.radius,
			this.radius,
			0.1,
			6,
			1
		);

		this.appearance = appearance;
		this.color = color;

		this.animation = null;

		this.finalPosition = [];
	}

	// move(finalX, finalZ) {
	// 	let	xOffset = finalX - this.position[0];
	// 	let	zOffset = finalZ - this.position[1];
		
	// 	let keyFrames = [
	// 		new Transformation(
	// 			0,
	// 			[0, 0, 0],
	// 			[0, 0, 0],
	// 			[1, 1, 1]
	// 		),
	// 		new Transformation(
	// 			0.5,
	// 			[0, 0, 0.2],
	// 			[0, 0, 0],
	// 			[1, 1, 1]
	// 		),
	// 		new Transformation(1, [xOffset, zOffset, 0.2], [0, 0, 0], [1, 1, 1]),
	// 		new Transformation(
	// 			1.5,
	// 			[xOffset, zOffset, -this.position[2] + 0.05],
	// 			[0, 0, 0],
	// 			[1, 1, 1]
	// 		)
	// 	];
	// 	this.animation = new KeyFrameAnimation(this.scene, keyFrames, "");

	// 	this.isMoving = true;
	// 	this.isInAuxBoard = false;
		
	// }

	move(finalX, finalZ, finalY) {

		let	xOffset = finalX - this.position[0];
		let	zOffset = finalZ - this.position[1];
		let yOffset = -this.position[2] + 0.05;
		if (finalY !== undefined) {
			xOffset = finalX - this.finalPosition[0];
			zOffset = finalZ - this.finalPosition[1];
			yOffset = finalY - this.finalPosition[2];
		}

		let keyFrames = [
			new Transformation(
				0,
				[0, 0, 0],
				[0, 0, 0],
				[1, 1, 1]
			),
			new Transformation(
				0.5,
				[0, 0, 0.2],
				[0, 0, 0],
				[1, 1, 1]
			),
			new Transformation(1, [xOffset, zOffset, 0.2], [0, 0, 0], [1, 1, 1]),
			new Transformation(
				1.5,
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
		this.finalPosition[0] = this.position[0] + this.animation.keyFrames[2].translation[0];
		this.finalPosition[1] = this.position[1] + this.animation.keyFrames[2].translation[1];
		this.finalPosition[2] = 0.05;
		console.log("POSITION:");
		console.log(this.animation.keyFrames);
		console.log(this.finalPosition);
	}


	update(currentTime) {
		if (this.isMoving && this.animation != null) {
			this.animation.update(currentTime);
		}
	}

	display() {
		this.scene.pushMatrix();
		this.appearance.apply();

		if (this.animation != null) {
			this.animation.apply();
		}

		if (this.isSelected) {
			this.scene.translate(0, 0, 1);
		}

		this.scene.translate(
			this.position[0],
			this.position[1],
			this.position[2]
		);

		this.tile.display();

		this.scene.popMatrix();
	}
}
