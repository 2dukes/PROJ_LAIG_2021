class MyPiece {
	constructor(scene, radius, appearance, height, zOffset, order) {
		this.scene = scene;
		this.radius = radius;
		this.height = height;
		this.zOffset = zOffset;
		this.order = order;
		this.isSelected = false;
		this.isMoving = false;

		this.tile = new MyCylinder(
			this.scene,
			this.radius,
			this.radius,
			0.2,
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

		this.scene.translate(0, this.zOffset, this.height);
		this.tile.display();

		this.scene.popMatrix();
	}
}
