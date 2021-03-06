class MyAuxBoard {
	constructor(scene) {
		this.scene = scene;

		this.initAppearances();
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

		this.texture1 = new CGFtexture(this.scene,"./scenes/images/tiles/purple_tile.png");
		this.purplePieceAp.setTexture(this.texture1);
		this.purplePieceAp.setTextureWrap("REPEAT", "REPEAT");
		this.purplePieceAp.apply();

		this.greenPieceAp = new CGFappearance(this.scene);
		this.greenPieceAp.setAmbient(0, 0.502, 0, 1); // Ambient RGB
		this.greenPieceAp.setDiffuse(0, 0.502, 0, 1); // Diffuse RGB
		this.greenPieceAp.setSpecular(0, 0, 0, 1); // Specular RGB
		this.greenPieceAp.setEmission(0, 0, 0, 1); // Emissive RGB
		this.greenPieceAp.setShininess(1);

		this.texture2 = new CGFtexture(this.scene,"./scenes/images/tiles/green_tile.png");
		this.greenPieceAp.setTexture(this.texture2);
		this.greenPieceAp.setTextureWrap("REPEAT", "REPEAT");
		this.greenPieceAp.apply();

		this.orangePieceAp = new CGFappearance(this.scene);
		this.orangePieceAp.setAmbient(1, 0.4, 0, 1); // Ambient RGB
		this.orangePieceAp.setDiffuse(1, 0.4, 0, 1); // Diffuse RGB
		this.orangePieceAp.setSpecular(0, 0, 0, 1); // Specular RGB
		this.orangePieceAp.setEmission(0, 0, 0, 1); // Emissive RGB
		this.orangePieceAp.setShininess(1);

		this.texture3 = new CGFtexture(this.scene,"./scenes/images/tiles/orange_tile.png");
		this.orangePieceAp.setTexture(this.texture3);
		this.orangePieceAp.setTextureWrap("REPEAT", "REPEAT");
		this.orangePieceAp.apply();

		this.selectedPieceAp=new CGFappearance(this.scene);
        this.selectedPieceAp.setAmbient(0,183/256,250/256,1); // Ambient RGB
        this.selectedPieceAp.setDiffuse(0,183/256,250/256,1); // Diffuse RGB
        this.selectedPieceAp.setSpecular(0,183/256,250/256,1); // Specular RGB
        this.selectedPieceAp.setEmission(0,0.1,0.1,1); // Emissive RGB/ Emissive RGB
        this.selectedPieceAp.setShininess(10); 

        this.texture4 = new CGFtexture(this.scene, "./scenes/images/tiles/selected_tile.png");
        this.selectedPieceAp.setTexture(this.texture4);
        this.selectedPieceAp.setTextureWrap('REPEAT', 'REPEAT');
        this.selectedPieceAp.apply();
	}

	getNextPiece(color) {

		let pieces;

		if (color == "purple") pieces = this.purplePieces;
		else if (color == "orange") pieces = this.orangePieces;
		else if (color == "green") pieces = this.greenPieces;
		
		for (let i = pieces.length - 1; i >= 0; i--) {
			for (let j = pieces[i].length - 1; j >= 0 ; j--) {
				if (pieces[i][j].isInAuxBoard) 
					return pieces[i][j];
			}
		}

		return null;
	}

	initializePieces() {

		this.purplePieces = [];
		this.greenPieces = [];
		this.orangePieces = [];

		let height = 0,
			zOffset = 0.5;

		let stackPurple = [];
		let stackGreen = [];
		let stackOrange = [];

		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 14; j++) {
				stackPurple.push(
					new MyPiece(
						this.scene, 
						0.25, 
						this.purplePieceAp,
						[-0.8,2.5 + zOffset,0.05 + height],
						"purple",
						this.selectedPieceAp,
						i
					)
				);
				stackGreen.push(
					new MyPiece(
						this.scene,
						0.25, this.greenPieceAp,
						[1.3,2.5 + zOffset,0.05 + height],
						"green",
						this.selectedPieceAp,
						i
					)
				);
				stackOrange.push(
					new MyPiece(this.scene,
						0.25,
						this.orangePieceAp,
						[0.2,2.5 + zOffset,0.05 + height],
						"orange",
						this.selectedPieceAp,
						i
					)
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

	getNextStackPosition(color, numStack) {

		let pieces;
		if (color == "purple") pieces = this.purplePieces;
		else if (color == "green") pieces = this.greenPieces;
		else if (color == "orange") pieces = this.orangePieces;

		for (let i = pieces[numStack].length - 1; i >= 0; i--) {
			if (pieces[numStack][i].isInAuxBoard) {
				let undoPiecePosition = pieces[numStack][i].position.slice();
				undoPiecePosition[2] = 0.05 + (i + 1)*0.05;
				return undoPiecePosition;
			}
		}

		return null; // nunca chega aqui
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
