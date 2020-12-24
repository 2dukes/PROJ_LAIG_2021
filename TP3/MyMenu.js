class MyMenu {
    constructor(scene) {
        this.scene = scene;

        this.initOptions();

        this.choseAll = false;
        
    }

    initOptions() {

        this.gameTitle = new MyRectangle(this.scene, 0, 0, 2, 1);

        this.gameModeTitle = new MyRectangle(this.scene, 0, 0, 1, 0.5);
        this.chooseGameMode = [];
        for (let i = 0; i < 3; i++) {
            this.chooseGameMode.push(new MyRectangle(this.scene, 0, 0, 1, 0.3));
        }
    }

    display() {

        this.scene.pushMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 2, 0);
        this.gameTitle.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 1.3, 0);
        this.gameModeTitle.display();
        this.scene.popMatrix();
        
        for (let i = 0; i < this.chooseGameMode.length; i++) {
            this.scene.translate(0, 0.3, 0);
            this.chooseGameMode[i].display();
        }

        this.scene.popMatrix();
    }
}