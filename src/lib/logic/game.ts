// 2048

type Point = { x: number; y: number };

type Direction = 'left' | 'right' | 'up' | 'down';

class Board {
	field: number[][];
	constructor() {
		this.field = [];
		for (let i = 0; i < 4; i++) {
			this.field.push([0, 0, 0, 0]);
		}
	}
	Clear() {
		for (let x = 0; x < 4; x++) {
			for (let y = 0; y < 4; y++) {
				this.SetField({ x, y }, 0);
			}
		}
	}
	GetField({ x, y }: Point) {
		return this.field[x][y];
	}
	SetField({ x, y }: Point, value: number) {
		// check if value in [0, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048]
		const validValues = [0, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048];
		if (!validValues.includes(value)) {
			throw new Error(`Invalid value ${value}`);
		}
		this.field[x][y] = value;
	}
	GetEmptyCells(): Point[] {
		const emptyCells: Point[] = [];
		for (let x = 0; x < 4; x++) {
			for (let y = 0; y < 4; y++) {
				if (this.GetField({ x, y }) === 0) {
					emptyCells.push({ x, y });
				}
			}
		}
		return emptyCells;
	}
	GetRandomEmptyCell() {
		const emptyCells = this.GetEmptyCells();
		return emptyCells[Math.floor(Math.random() * emptyCells.length)];
	}
	AddRandomTile() {
		const emptyCell = this.GetRandomEmptyCell();
		this.SetField(emptyCell, Math.random() > 0.5 ? 2 : 4);
	}
	MoveLeft() {
		throw new Error('Not implemented');
	}
	MoveRight() {
		throw new Error('Not implemented');
	}
	MoveUp() {
		throw new Error('Not implemented');
	}
	MoveDown() {
		throw new Error('Not implemented');
	}
	Move(direction: Direction) {
		switch (direction) {
			case 'left':
				this.MoveLeft();
				break;
			case 'right':
				this.MoveRight();
				break;
			case 'up':
				this.MoveUp();
				break;
			case 'down':
				this.MoveDown();
				break;
		}
	}
    AsArray() {
        return this.field;
    }
}

class Game {
	board: Board;
	constructor() {
		this.board = new Board();
		this.board.AddRandomTile();
		this.board.AddRandomTile();
	}
	Move(direction: Direction) {
		this.board.Move(direction);
		this.board.AddRandomTile();
	}
}

export { Game, Board };
export type { Direction };
