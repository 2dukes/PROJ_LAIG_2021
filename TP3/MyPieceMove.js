// Apenas para armazenar o movimento

class MyPieceMove {
	constructor(scene, pieceToMove, finalX, finalY, board, whoPlayed) {
		this.scene = scene;
		this.pieceToMove = pieceToMove;
		this.finalX = finalX;
		this.finalY = finalY;
		this.board = board;
		this.whoPlayed = whoPlayed;
	}
}
