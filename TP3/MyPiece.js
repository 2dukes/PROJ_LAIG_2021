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
		let initX = this.position[0];
		let initZ = this.position[1];
		let xOffset = finalX - initX;
		let zOffset = finalZ - initZ;

		let keyFrames = [
			new Transformation(
				2,
				// [this.position[0], this.position[1], this.position[2]],
				[0, 0, 0],
				[0, 0, 0],
				[1, 1, 1]
			),
			new Transformation(3, [0, 0, this.position[2]], [0, 0, 0], [1, 1, 1]),
			new Transformation(4, [xOffset, zOffset, 0], [0, 0, 0], [1, 1, 1]),
			new Transformation(5, [xOffset, zOffset, -this.position[2]], [0, 0, 0], [1, 1, 1]),
			
		];
		this.animation = new KeyFrameAnimation(this.scene, keyFrames, "");
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

		this.scene.translate(
			this.position[0],
			this.position[1],
			this.position[2]
		);

		/* if (this.isInAuxBoard)
			this.scene.translate(
				this.position[0],
				this.position[1],
				this.position[2]
			);
		else {
			this.scene.translate(this.position[0], this.position[1], 0);
		}
 */
		this.tile.display();

		this.scene.popMatrix();
	}
}
