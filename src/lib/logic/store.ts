import { Board, Game, type Direction } from './game';
import { writable, type Writable } from 'svelte/store';

class WritableGame extends Game {
	writable: Writable<Board> = writable(this.board);
	constructor() {
		super();
	}
	Move(direction: Direction) {
		super.Move(direction);
		this.writable.set(this.board);
	}
	subscribe = this.writable.subscribe;
}

export { WritableGame as Game };
