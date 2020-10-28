class Animation {
    constructor(scene, animationID) {
        this.scene = scene;
        
        this.elapsedTime = 0;
        this.animationEnded = false;
        this.currentState = mat4.create();
        this.animationID = animationID;
    }

    update(currentTime) {
        this.elapsedTime += currentTime;
    }

    apply() {
        
    }
}

// time
// animationHasEnded?
// currentState
// id Animação