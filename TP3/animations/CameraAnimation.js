/**
 * Animation representing two cameras
 */
class CameraAnimation extends Animation {

    constructor(scene, animationId, firstCamera, secondCamera, timeLen) {
        super(scene, animationId);

        this.scene = scene;
        this.positionFirstCamera = firstCamera.position;
        this.targetFirstCamera = firstCamera.target;
        this.directionFirstCamera = firstCamera.direction;
        this.nearFirstCamera = firstCamera.near;
        this.farFirstCamera = firstCamera.far;
        this.angleFirstCamera = firstCamera.fov;

        this.positionSecondCamera = secondCamera.position;
        this.targetSecondCamera = secondCamera.target;
        this.directionSecondCamera = secondCamera.direction;
        this.nearSecondCamera = secondCamera.near;
        this.farSecondCamera = secondCamera.far;
        this.angleSecondCamera = secondCamera.fov;

        this.timeLen = timeLen;
    }

    apply() {

        if (this.animationEnded) {
            return;

        }

        if (this.timeLen < this.elapsedTime) {
            this.animationEnded = true;
            this.setCamera(this.angleSecondCamera, this.nearSecondCamera, this.farSecondCamera, this.positionSecondCamera, this.targetSecondCamera);
            
            if(this.scene.gameOrchestrator.playingMovie) {
                document.querySelector('#messages').style.display = "block";
                document.querySelector('#messages').innerHTML = "Playing Movie...";
            }
            else if(this.scene.menu.choseAll && this.scene.gameOrchestrator.gameMode == "PvP") {
                document.querySelector('#messages').style.display = "block";
                document.querySelector('#messages').innerHTML = `Player ${this.scene.gameOrchestrator.gameBoard.currentPlayer} turn!`;
            } else if(this.scene.menu.choseAll && this.scene.gameOrchestrator.gameMode == "PvB") {
                document.querySelector('#messages').style.display = "block";
                if(this.scene.gameOrchestrator.gameBoard.currentPlayer == this.scene.gameOrchestrator.gameBoard.players.FIRSTPLAYER) { // Player
                    document.querySelector('#messages').innerHTML = `Player ${this.scene.gameOrchestrator.gameBoard.currentPlayer} turn!`;
                } else // BOT
                    document.querySelector('#messages').innerHTML = "Waiting for Computer...";
            } else {
                document.querySelector('#messages').style.display = "none";
            }
            return;
        }

        var percentageTime = (this.timeLen - this.elapsedTime) / this.timeLen;

        let newPosition = [];
        vec3.lerp(
            newPosition,
            vec3.fromValues(this.positionSecondCamera[0], this.positionSecondCamera[1], this.positionSecondCamera[2]),
            vec3.fromValues(this.positionFirstCamera[0], this.positionFirstCamera[1], this.positionFirstCamera[2]),
            percentageTime
        );

        let newTarget = [];
        vec3.lerp(
            newTarget,
            vec3.fromValues(this.targetSecondCamera[0], this.targetSecondCamera[1], this.targetSecondCamera[2]),
            vec3.fromValues(this.targetFirstCamera[0], this.targetFirstCamera[1], this.targetFirstCamera[2]),
            percentageTime
        );
        
        let nearFarFov = [];
        vec3.lerp(
            nearFarFov,
            vec3.fromValues(this.nearSecondCamera, this.farSecondCamera, this.angleSecondCamera),
            vec3.fromValues(this.nearFirstCamera, this.farFirstCamera, this.angleFirstCamera),
            percentageTime
        );

        this.setCamera(nearFarFov[2], nearFarFov[0], nearFarFov[1], vec3.fromValues(newPosition[0], newPosition[1], newPosition[2]), vec3.fromValues(newTarget[0], newTarget[1], newTarget[2]));

    }

    setCamera(fov, near, far, position, target) {
        this.scene.camera = new CGFcamera(fov, near, far, position, target)
        this.scene.interface.setActiveCamera(this.camera);
        this.scene.newCamera = this.scene.camera;
    }
}