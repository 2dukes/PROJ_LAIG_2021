class MyMenu {
    constructor(scene) {
        this.scene = scene;

        this.initTextures();
        this.initOptions();

        this.choseAll = false;

        this.pickedNow = null;

        this.scene.setPickEnabled(true);
    }

    initTextures() {
        this.menuAppearance = new CGFappearance(this.scene);
        // this.menuAppearance.setAmbient(0, 0.502, 0, 1); // Ambient RGB
        // this.menuAppearance.setDiffuse(0, 0.502, 0, 1); // Diffuse RGB
        // this.menuAppearance.setSpecular(0, 0, 0, 1); // Specular RGB
        // this.menuAppearance.setEmission(0, 0, 0, 1); // Emissive RGB
        // this.menuAppearance.setShininess(1);

        this.textures = {
                "title": new CGFtexture(this.scene, "./scenes/images/menu/title.png"),
                "gameModeTitle": new CGFtexture(this.scene, "./scenes/images/menu/game_mode.png"),
                "PvP": new CGFtexture(this.scene, "./scenes/images/menu/player_vs_player.png"),
                "PvB": new CGFtexture(this.scene, "./scenes/images/menu/player_vs_bot.png"),
                "BvB": new CGFtexture(this.scene, "./scenes/images/menu/bot_vs_bot.png"),
                "gameLevelTitle": new CGFtexture(this.scene, "./scenes/images/menu/game_level.png"),
                "random": new CGFtexture(this.scene, "./scenes/images/menu/random.png"),
                "greedy": new CGFtexture(this.scene, "./scenes/images/menu/greedy.png"),
                "hard": new CGFtexture(this.scene, "./scenes/images/menu/hard.png"),
                "ok": new CGFtexture(this.scene, "./scenes/images/menu/ok.png")
            };

        this.modeNames = ["PvP", "PvB", "BvB"];
        this.levelNames = ["random", "greedy", "hard"];

    }

    initOptions() {
        
        this.gameTitle = new MyRectangle(this.scene, 0, 0, 2, 1);
        this.subtitle = new MyRectangle(this.scene, 0, 0, 1, 0.5);

        this.chooseGameMode = [];
        for (let i = 0; i < 3; i++) {
            this.chooseGameMode.push(new MyMenuButton(this.scene, 0, 0, 1, 0.3, this.modeNames[i], 1000+i));
        }

        this.chooseLevelMode = [];
        for (let i = 0; i < 3; i++) {
            this.chooseLevelMode.push(new MyMenuButton(this.scene, 0, 0, 1, 0.3, this.levelNames[i],1010+i));
        }

        this.okButton = new MyMenuButton(this.scene, 0, 0, 1, 0.3, "ok",1020);

        this.choseMode = "";
        this.choseLevel = "";
    }

    logPicking() {

		if (this.scene.pickMode == false) {
			if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
				for (var i = 0; i < this.scene.pickResults.length; i++) {
                    
                    this.pickedNow = this.scene.pickResults[i][0];
					if (this.pickedNow instanceof MyMenuButton) {
                        this.pickedNow.isSelected = true;

                        if (this.pickedNow.optionName == "ok") {
                            if (this.checkAllSelected()) {
                                this.choseAll = true;
                                this.scene.gameOrchestrator.gameMode = this.choseMode;
                                this.scene.gameOrchestrator.gameBoard.gameLevel = this.choseLevel;
                            }
                        }

                        

                        if (this.pickedNow.optionName == "PvP") this.choseMode = "PvP";
                        else if (this.pickedNow.optionName == "PvB") this.choseMode = "PvB";
                        else if (this.pickedNow.optionName == "BvB") this.choseMode = "BvB";

                        else if (this.pickedNow.optionName == "greedy") this.choseLevel = "greedy";
                        else if (this.pickedNow.optionName == "hard") this.choseLevel = "greedy_hard";
                        else if (this.pickedNow.optionName == "random") this.choseLevel = "random";
         

                        
                        
                            
                            if (this.modeNames.includes(this.pickedNow.optionName)) {
                                for (let k = 0; k < this.chooseGameMode.length; k++) {
                                    if (this.chooseGameMode[k].isSelected && this.chooseGameMode[k].id != this.pickedNow.id)
                                        this.chooseGameMode[k].isSelected = false;
                                }
                            }
                            else if (this.levelNames.includes(this.pickedNow.optionName)) {
                                for (let k = 0; k < this.chooseLevelMode.length; k++) {
                                    if (this.chooseLevelMode[k].isSelected && this.chooseLevelMode[k].id != this.pickedNow.id)
                                        this.chooseLevelMode[k].isSelected = false;
                                }
                            }
                        
                        

                    }

                    
				
				}
			}
			this.scene.pickResults.splice(0, this.scene.pickResults.length);
		}
    }
    
    checkAllSelected() {
        return (this.choseMode != "" && this.choseLevel != "") || (this.choseMode == "PvP");
    }

    display() {

        this.logPicking();

        this.scene.pushMatrix();

        // ------------ TITLE -----------------------
        this.scene.pushMatrix();
        this.scene.translate(0.5, 2, 0);
        
        this.menuAppearance.setTexture(this.textures["title"]);
        this.menuAppearance.apply();
        
        this.gameTitle.display();
        this.scene.popMatrix();

        // ------------ GAME MODE -----------------------
        this.scene.pushMatrix();
        this.scene.translate(0, 1, 0);

        this.menuAppearance.setTexture(this.textures["gameModeTitle"]);
		this.menuAppearance.apply();

        this.subtitle.display();
        this.scene.popMatrix();
        
        for (let i = 0; i < this.chooseGameMode.length; i++) {

            this.scene.pushMatrix();

            this.scene.translate(0, 0.3*i, 0);
            this.menuAppearance.setTexture(this.textures[this.modeNames[i]]);
		    this.menuAppearance.apply();

            this.chooseGameMode[i].display();

            this.scene.popMatrix();
        }
        this.scene.clearPickRegistration();


        // ------------ GAME LEVEL -----------------------
        this.scene.pushMatrix();
        this.scene.translate(2, 1, 0);

        this.menuAppearance.setTexture(this.textures["gameLevelTitle"]);
        this.menuAppearance.apply();

        this.subtitle.display();
        this.scene.popMatrix();

        for (let i = 0; i < this.chooseLevelMode.length; i++) {

            this.scene.pushMatrix();
            this.scene.translate(2, 0.3*i, 0);
            this.menuAppearance.setTexture(this.textures[this.levelNames[i]]);
		    this.menuAppearance.apply();

            this.chooseLevelMode[i].display();
            

            this.scene.popMatrix();
        }
        this.scene.clearPickRegistration();

        // ------------ OK -----------------------
        this.scene.pushMatrix();
        this.scene.translate(1, -1, 0);

        this.menuAppearance.setTexture(this.textures["ok"]);
        this.menuAppearance.apply();

        this.okButton.display();
        this.scene.clearPickRegistration();
        this.scene.popMatrix();


        this.scene.popMatrix();

        
    }
}