class MyMenuButton {
    constructor(scene, x1, y1, x2, y2, optionName, id) {
        this.scene = scene;
        this.optionName = optionName;
        this.id = id;
        
        this.initButton(x1, y1, x2, y2);
    }

    initButton(x1, y1, x2, y2) {
        this.button = new MyRectangle(this.scene, x1, y1, x2, y2);
        this.isSelected = false;
        this.defaultAp = new CGFappearance(this.scene);
        this.defaultAp.setTexture(null);
    }
    
    display() {
        this.scene.registerForPick(this.id, this);

        this.scene.pushMatrix();
        if (this.isSelected) {
            this.scene.translate(-0.05,0,0);
            this.scene.scale(1.1,1.1,1.1);
        }

        this.button.display();

        this.scene.popMatrix();

    }
}