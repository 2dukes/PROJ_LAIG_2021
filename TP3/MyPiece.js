class MyPiece {
	constructor(scene, radius, appearance, height, zOffset) {
		this.scene = scene;
		this.radius = radius;
		this.height = height;
		this.zOffset = zOffset;
		this.isSelected = false;
		this.isMoving = false;
		this.isInAuxBoard = true;

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

	move(initX, initZ, finalX, finalZ) {
		let xOffset = finalX - initX;
		let zOffset = finalZ - initZ;
		let keyFrames = [
			new Transformation(5, [0, 0, 0], [0, 0, 0], [1, 1, 1]),
			new Transformation(6, [xOffset, -zOffset, 0], [0, 0, 0], [1, 1, 1]),
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

		if (this.isInAuxBoard)
			this.scene.translate(0, this.zOffset, this.height);

		this.tile.display();

		this.scene.popMatrix();
	}
}
