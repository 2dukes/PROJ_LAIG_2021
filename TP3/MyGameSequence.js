
class MyGameSequence {
    constructor(scene) {
		this.scene = scene;

		this.moves = [];
    }
    
    addMove(move) {
        this.moves.push(move);
    }

    undo() { 
        let undoMove = this.moves[this.moves.length - 1];
        this.moves.pop();
        return undoMove;
    }
}