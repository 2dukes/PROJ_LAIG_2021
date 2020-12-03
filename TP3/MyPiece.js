class MyPiece {
	constructor(scene, radius, appearance, height, zOffset, order) {
		this.scene = scene;
		this.radius = radius;
		this.height = height;
		this.zOffset = zOffset;
		this.order = order;
		this.isSelected = false;

		this.tile = new MyCylinder(
			this.scene,
			this.radius,
			this.radius,
			0.2,
			6,
			1
		);

		this.appearance = appearance;
	}

	display() {
		this.scene.pushMatrix();
		this.appearance.apply();

		this.scene.translate(0, this.zOffset, this.height);
		this.tile.display();

		this.scene.popMatrix();
	}
}
