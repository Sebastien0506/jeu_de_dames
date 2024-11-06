type Move = { startRow: number; startCol: number; endRow: number; endCol: number };
type Board = string[][];

export class Game {
    board: Board;
    isPlayerTurn: boolean;
    selectedPiece: { row: number, col: number } | null;

    constructor() {
        this.board = this.createBoard();
        this.isPlayerTurn = true; // Le joueur commence
        this.selectedPiece = null; // Aucune pièce sélectionnée au départ
    }

    // Initialise le plateau de jeu avec les pions en place
    createBoard(): Board {
        const board: Board = [];
        for (let row = 0; row < 10; row++) {
            const rowArr: string[] = [];
            for (let col = 0; col < 10; col++) {
                if ((row + col) % 2 === 0) {
                    rowArr.push(" ");
                } else if (row < 4) {
                    rowArr.push("B");
                } else if (row > 5) {
                    rowArr.push("W");
                } else {
                    rowArr.push(" ");
                }
            }
            board.push(rowArr);
        }
        console.log("Plateau initialiser : ", board);
        return board;
    }

    // Déplace une pièce, vérifie si elle peut capturer, et retourne true si le mouvement est valide
    // movePiece(startRow: number, startCol: number, endRow: number, endCol: number): boolean {
    //     const player = this.board[startRow][startCol];
    //     const opponent = player === "B" ? "W" : "B";

    //     // Vérifie si le mouvement est un saut avec capture
    //     if (this.board[endRow][endCol] === " " && Math.abs(startRow - endRow) === 2) {
    //         const midRow = (startRow + endRow) / 2;
    //         const midCol = (startCol + endCol) / 2;

    //         if (this.board[midRow][midCol] === opponent) {
    //             // Effectue la capture
    //             this.board[endRow][endCol] = player;
    //             this.board[startRow][startCol] = " ";
    //             this.board[midRow][midCol] = " "; // Retire le pion capturé
    //             return true;
    //         }
    //     }
    //     return false;
    // }
    movePiece(startRow: number, startCol: number, endRow: number, endCol: number): boolean {
        if (this.board[endRow][endCol] === " " && Math.abs(startRow - endRow) === 1 && Math.abs(startCol - endCol) === 1) {
            this.board[endRow][endCol] = this.board[startRow][startCol];
            this.board[startRow][startCol] = " ";
            return true;
        }
        return false;
    }
    

    // Renvoie tous les mouvements possibles pour un joueur donné
    getPossibleMoves(player: string): Move[] {
        const moves: Move[] = [];
        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 10; col++) {
                if (this.board[row][col] === player) {
                    const direction = player === "B" ? 1 : -1;
                    if (this.isValidMove(row, col, row + direction, col - 1)) {
                        moves.push({ startRow: row, startCol: col, endRow: row + direction, endCol: col - 1 });
                    }
                    if (this.isValidMove(row, col, row + direction, col + 1)) {
                        moves.push({ startRow: row, startCol: col, endRow: row + direction, endCol: col + 1 });
                    }
                }
            }
        }
        return moves;
    }

    // Vérifie si un mouvement est valide
    isValidMove(startRow: number, startCol: number, endRow: number, endCol: number): boolean {
        return endRow >= 0 && endRow < 10 && endCol >= 0 && endCol < 10 && this.board[endRow][endCol] === " ";
    }

    // Gère le tour du joueur
    playTurn(startRow: number, startCol: number, endRow: number, endCol: number) {
        if (this.isPlayerTurn) {
            if (this.movePiece(startRow, startCol, endRow, endCol)) {
                this.displayBoard();
                this.isPlayerTurn = false;
                setTimeout(() => this.computerTurn(), 500);
            }
        }
    }
    
    // Gère le tour de l'ordinateur en choisissant un mouvement aléatoire
    computerTurn() {
        const possibleMoves = this.getPossibleMoves("W");
        if (possibleMoves.length > 0) {
            const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            this.movePiece(randomMove.startRow, randomMove.startCol, randomMove.endRow, randomMove.endCol);
            this.displayBoard();
        }
        this.isPlayerTurn = true;
    }

    displayBoard(): void {
        const boardElement = document.getElementById("board");
        if (boardElement) {
            boardElement.innerHTML = ''; // Efface le contenu précédent
            this.board.forEach((row, rowIndex) => {
                const rowDiv = document.createElement("div");
                rowDiv.style.display = "flex";
                row.forEach((cell, colIndex) => {
                    console.log(`Création de la case : rowIndex=${rowIndex}, colIndex=${colIndex}`);
                    const cellDiv = document.createElement("div");
                    cellDiv.style.width = "50px";
                    cellDiv.style.height = "50px";
                    cellDiv.style.display = "flex";
                    cellDiv.style.alignItems = "center";
                    cellDiv.style.justifyContent = "center";
                    cellDiv.style.border = "1px solid black";
    
                    // Définir les couleurs des cases
                    const isGrayCell = (rowIndex + colIndex) % 2 !== 0;
                    cellDiv.style.backgroundColor = isGrayCell ? "gray" : "white";
    
                    // Si la case contient un pion, crée un cercle cliquable
                    if (cell === "B" || cell === "W") {
                        const piece = document.createElement("div");
                        piece.style.width = "30px";
                        piece.style.height = "30px";
                        piece.style.borderRadius = "50%";
                        piece.style.backgroundColor = cell === "B" ? "black" : "white";
                        piece.style.cursor = "pointer"; // Change le curseur pour montrer qu'il est cliquable
    
                        // Ajoute un gestionnaire de clic au pion
                        piece.addEventListener("click", (event) => {
                            event.stopPropagation(); // Empêche le clic de se propager à la case
                            this.handlePieceClick(rowIndex, colIndex);
                            console.log("Le pion est sélectionné à :", rowIndex, colIndex);
                        });
    
                        cellDiv.appendChild(piece);
                    }
    
                    // Rendre la case elle-même cliquable pour le déplacement
                    cellDiv.addEventListener("click", () => {
                        console.log("Clic sur la case vide :", rowIndex, colIndex);
                        this.handleMoveClick(rowIndex, colIndex);
                    });
    
                    rowDiv.appendChild(cellDiv);
                });
                boardElement.appendChild(rowDiv);
            });
        }
    }
    
    
    
    
    
    
    handlePieceClick(row: number, col: number): void {
        if (this.isPlayerTurn && this.board[row][col] === "B") { // Assure que c'est le tour du joueur et que le pion est noir
            this.selectedPiece = { row, col }; // Stocke la position du pion sélectionné
            console.log("Pion sélectionné à :", this.selectedPiece);
        }
    }
    

    handleMoveClick(row: number, col: number): void {
        console.log("Clic sur la case vide : ", row, col);
        if (this.selectedPiece) {
            const startRow = this.selectedPiece.row;
            const startCol = this.selectedPiece.col;
            console.log("Tentative de déplacement de :", startRow, startCol, "vers", row, col);

    
            if (this.movePiece(startRow, startCol, row, col)) { // Si le mouvement est valide
                console.log("Déplacement réussi de", startRow, startCol, "à", row, col);
                this.displayBoard(); // Met à jour l'affichage
                this.selectedPiece = null; // Réinitialise la sélection
                this.isPlayerTurn = false; // Passe au tour de l'ordinateur
                setTimeout(() => this.computerTurn(), 500); // Lance le tour de l'ordinateur après une courte pause
            } else {
                console.log("Déplacement invalide.");
            }
        }
    }
    
    
    
    
    // Vérifie si la partie est terminée
    checkGameOver(): boolean {
        const playerMoves = this.getPossibleMoves("B");
        const computerMoves = this.getPossibleMoves("W");
    
        if (playerMoves.length === 0) {
            alert("L'ordinateur a gagné !");
            return true;
        } else if (computerMoves.length === 0) {
            alert("Le joueur a gagné !");
            return true;
        }
        return false;
    }
}
