class MyAuxBoard {
	constructor(scene) {
		this.scene = scene;

		this.initAppearances();

		this.purplePieces = [];
		this.greenPieces = [];
		this.orangePieces = [];
		this.initializePieces();

		this.pickEnabled = true;
	}

	initAppearances() {
		this.purplePieceAp = new CGFappearance(this.scene);
		this.purplePieceAp.setAmbient(0.302, 0, 0.302, 1); // Ambient RGB
		this.purplePieceAp.setDiffuse(0.302, 0, 0.302, 1); // Diffuse RGB
		this.purplePieceAp.setSpecular(0.0, 0, 0.0, 1); // Specular RGB
		this.purplePieceAp.setEmission(0.1, 0, 0.1, 1); // Emissive RGB
		this.purplePieceAp.setShininess(1);

		this.texture1 = new CGFtexture(
			this.scene,
			"./scenes/images/tiles/purple_tile.png"
		);
		this.purplePieceAp.setTexture(this.texture1);
		this.purplePieceAp.setTextureWrap("REPEAT", "REPEAT");
		this.purplePieceAp.apply();

		this.greenPieceAp = new CGFappearance(this.scene);
		this.greenPieceAp.setAmbient(0, 0.502, 0, 1); // Ambient RGB
		this.greenPieceAp.setDiffuse(0, 0.502, 0, 1); // Diffuse RGB
		this.greenPieceAp.setSpecular(0, 0, 0, 1); // Specular RGB
		this.greenPieceAp.setEmission(0, 0, 0, 1); // Emissive RGB
		this.greenPieceAp.setShininess(1);

		this.texture2 = new CGFtexture(
			this.scene,
			"./scenes/images/tiles/green_tile.png"
		);
		this.greenPieceAp.setTexture(this.texture2);
		this.greenPieceAp.setTextureWrap("REPEAT", "REPEAT");
		this.greenPieceAp.apply();

		this.orangePieceAp = new CGFappearance(this.scene);
		this.orangePieceAp.setAmbient(1, 0.4, 0, 1); // Ambient RGB
		this.orangePieceAp.setDiffuse(1, 0.4, 0, 1); // Diffuse RGB
		this.orangePieceAp.setSpecular(0, 0, 0, 1); // Specular RGB
		this.orangePieceAp.setEmission(0, 0, 0, 1); // Emissive RGB
		this.orangePieceAp.setShininess(1);

		this.texture3 = new CGFtexture(
			this.scene,
			"./scenes/images/tiles/orange_tile.png"
		);
		this.orangePieceAp.setTexture(this.texture3);
		this.orangePieceAp.setTextureWrap("REPEAT", "REPEAT");
		this.orangePieceAp.apply();
	}

	initializePieces() {
		let height = 0,
			zOffset = 0.5;

		let stackPurple = [];
		let stackGreen = [];
		let stackOrange = [];

		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 14; j++) {
				stackPurple.push(
					new MyPiece(this.scene, 0.25, this.purplePieceAp, [
						-0.8,
						2.5 + zOffset,
						0.05 + height,
					],"purple")
				);
				stackGreen.push(
					new MyPiece(this.scene, 0.25, this.greenPieceAp, [
						1.3,
						2.5 + zOffset,
						0.05 + height,
					],"green")
				);
				stackOrange.push(
					new MyPiece(this.scene, 0.25, this.orangePieceAp, [
						0.2,
						2.5 + zOffset,
						0.05 + height,
					],"orange")
				);
				height += 0.05;
			}
			this.purplePieces.push(stackPurple);
			this.greenPieces.push(stackGreen);
			this.orangePieces.push(stackOrange);
			stackPurple = [];
			stackGreen = [];
			stackOrange = [];
			zOffset -= 0.5;
			height = 0;
		}
	}

	display() {
		this.scene.pushMatrix();
		for (let i = 0; i < this.purplePieces.length; i++) {
			for (let j = 0; j < this.purplePieces[i].length; j++) {
				if (this.pickEnabled && this.purplePieces[i][j].isInAuxBoard) this.scene.registerForPick(200 + i, this.purplePieces[i][j]);
				if (!this.purplePieces[i][j].isInAuxBoard) this.scene.clearPickRegistration();
				this.purplePieces[i][j].display();
			}	
		}
		this.scene.popMatrix();

		this.scene.pushMatrix();
		for (let i = 0; i < this.greenPieces.length; i++) {
			for (let j = 0; j < this.greenPieces[i].length; j++) {
				if (this.pickEnabled && this.greenPieces[i][j].isInAuxBoard) this.scene.registerForPick(300 + i, this.greenPieces[i][j]);
				if (!this.greenPieces[i][j].isInAuxBoard) this.scene.clearPickRegistration();
				this.greenPieces[i][j].display();
			}
				
		}
		this.scene.popMatrix();

		this.scene.pushMatrix();
		for (let i = 0; i < this.orangePieces.length; i++) {
			for (let j = 0; j < this.orangePieces[i].length; j++) {
				if (this.pickEnabled && this.orangePieces[i][j].isInAuxBoard) this.scene.registerForPick(400 + i, this.orangePieces[i][j]);
				if (!this.orangePieces[i][j].isInAuxBoard) this.scene.clearPickRegistration();
				this.orangePieces[i][j].display();
			}
				
		}
		this.scene.popMatrix();
	}
}
