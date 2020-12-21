class MyPiece {
	constructor(scene, radius, appearance, position) {
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

		this.animation = null;
	}

	move(finalX, finalZ) {
		let xOffset = finalX - this.position[0];
		let zOffset = finalZ - this.position[1];

		let keyFrames = [
			new Transformation(
				0.1,
				// [this.position[0], this.position[1], this.position[2]],
				[0, 0, 0],
				[0, 0, 0],
				[1, 1, 1]
			),
			new Transformation(2, [xOffset, zOffset, 0], [0, 0, 0], [1, 1, 1]),
			new Transformation(
				2.4,
				[xOffset, zOffset, -this.position[2] + 0.05],
				[0, 0, 0],
				[1, 1, 1]
			),
		];
		this.animation = new KeyFrameAnimation(this.scene, keyFrames, "");

		this.isMoving = true;
		this.isInAuxBoard = false;
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
