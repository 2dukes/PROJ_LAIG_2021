// Apenas para armazenar o movimento

class MyPieceMove {
	constructor(scene, pieceToMove, finalX, finalY, board, whoPlayed, player1Score, player2Score) {
		this.scene = scene;
		this.pieceToMove = pieceToMove;
		this.finalX = finalX;
		this.finalY = finalY;
		this.board = board;
		this.whoPlayed = whoPlayed;
		this.player1Score = player1Score;
		this.player2Score = player2Score;
	}
}
