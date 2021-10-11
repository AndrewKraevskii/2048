class Field {
    constructor(field_size_px, cells_in_row, cell_margin, start_numbers_count, font_size) {
        this.size_px = field_size_px;
        this.cells = cells_in_row;
        this.cell_margin = cell_margin;
        this.start_numbers_count = start_numbers_count;
        this.font_size = font_size;
        this.cells_list = new Array(this.cells);
        this.restart_field();
        this.addNumbers();
    }

    restart_field () {
        this.cells_list = new Array(this.cells);
        for (let i = 0; i < this.cells_list.length; ++i) {
            this.cells_list[i] = new Array(this.cells)
        }
    }

    draw(canvas) {
        canvas.width = this.size_px;
        canvas.height = this.size_px;
        var ctx = canvas.getContext('2d');
    
        let box_size = this.size_px / this.cells;
        ctx.fillStyle = '#bbada0';
        ctx.fillRect(0, 0, this.size_px, this.size_px);
        for (let i = 0; i < this.cells; ++i) {
            for (let j = 0; j < this.cells; ++j) {
                if (this.cells_list[i][j]) {
                    ctx.fillStyle = background[this.cells_list[i][j]]?.color || background['super']?.color;
                    roundRect(ctx, box_size * j + this.cell_margin, box_size * i + this.cell_margin,
                        box_size - 2 * this.cell_margin, box_size - 2 * this.cell_margin,
                        1 / 45 * this.size_px, true, false)
                    ctx.font = `${(background[this.cells_list[i][j]]?.font_size || background['super'].font_size) * this.font_size}px sans`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = 'black';
                    ctx.fillText(`${this.cells_list[i][j]}`, box_size * j + box_size / 2, box_size * i + box_size / 2);
                } else {
                    ctx.fillStyle = 'rgba(238, 228, 218, 0.35)';
                    roundRect(ctx, box_size * j + this.cell_margin, box_size * i + this.cell_margin,
                        box_size - 2 * this.cell_margin, box_size - 2 * this.cell_margin,
                        1 / 45 * this.size_px, true, false)
                }
            }
        }
    }

    addNumber() {
        let cell_number = undefined;
        while (true) {
            cell_number = Math.floor(Math.random() * this.cells * this.cells)
            if (this.cells_list[Math.floor(cell_number / this.cells)][cell_number % this.cells] == undefined) {
                this.cells_list[Math.floor(cell_number / this.cells)][cell_number % this.cells] = Math.random() < 0.7 ? '2' : '4';
                break;
            }
        }
    }
    addNumbers(number=this.start_numbers_count) {
        for (let i = 0; i < number; ++i) {
            this.addNumber();
        }        
    }

    moveLeft() {
        let is_any_tile_move = false;
        for (let i = 0; i < this.cells; ++i) {
            for (let j = 1; j < this.cells; ++j) {
                if (this.cells_list[i][j] == undefined) {
                    continue;
                }
                let cj = j - 1;
                for (; ; --cj) {
                    if (cj < 0) {
                        this.cells_list[i][cj + 1] = this.cells_list[i][j];
                        this.cells_list[i][j] = undefined;
                        is_any_tile_move = true;
                        break;
                    }
                    if (this.cells_list[i][cj] != undefined) {
                        if (cj + 1 != j && this.cells_list[i][cj] != this.cells_list[i][j]) {
                            this.cells_list[i][cj + 1] = this.cells_list[i][j];
                            this.cells_list[i][j] = undefined;
                            is_any_tile_move = true;
                        } else if (this.cells_list[i][cj] == this.cells_list[i][j]) {
                            this.cells_list[i][cj] = '' + 2 * (+this.cells_list[i][j]);
                            this.cells_list[i][j] = undefined;
                            is_any_tile_move = true;
                        }
                        break;
                    }
    
                }
            }
        }
        return is_any_tile_move;
    }
    
    moveUp() {
        let is_any_tile_move = false;
        for (let i = 1; i < this.cells; ++i) {
            for (let j = 0; j < this.cells; ++j) {
                if (this.cells_list[i][j] == undefined) {
                    continue;
                }
                let ci = i - 1;
                for (; ; --ci) {
                    if (ci < 0) {
                        this.cells_list[ci + 1][j] = this.cells_list[i][j];
                        this.cells_list[i][j] = undefined;
                        is_any_tile_move = true;
                        break;
                    }
                    if (this.cells_list[ci][j] != undefined) {
                        if (ci + 1 != i && this.cells_list[ci][j] != this.cells_list[i][j]) {
                            this.cells_list[ci + 1][j] = this.cells_list[i][j];
                            this.cells_list[i][j] = undefined;
                            is_any_tile_move = true;
                        } else if (this.cells_list[ci][j] == this.cells_list[i][j]) {
                            this.cells_list[ci][j] = '' + 2 * (+this.cells_list[i][j]);
                            this.cells_list[i][j] = undefined;
                            is_any_tile_move = true;
                        }
                        break;
                    }
    
                }
            }
        }
        return is_any_tile_move;
    }
    
    moveRight() {
        let is_any_tile_move = false;
        for (let i = 0; i < this.cells; ++i) {
            for (let j = this.cells - 2; j >= 0; --j) {
                if (this.cells_list[i][j] == undefined) {
                    continue;
                }
                let cj = j + 1;
                for (; ; ++cj) {
                    if (cj >= this.cells) {
                        this.cells_list[i][cj - 1] = this.cells_list[i][j];
                        this.cells_list[i][j] = undefined;
                        is_any_tile_move = true;
                        break;
                    }
                    if (this.cells_list[i][cj] != undefined) {
                        if (cj - 1 != j && this.cells_list[i][cj] != this.cells_list[i][j]) {
                            this.cells_list[i][cj - 1] = this.cells_list[i][j];
                            this.cells_list[i][j] = undefined;
                            is_any_tile_move = true;
                        } else if (this.cells_list[i][cj] == this.cells_list[i][j]) {
                            this.cells_list[i][cj] = '' + 2 * (+this.cells_list[i][j]);
                            this.cells_list[i][j] = undefined;
                            is_any_tile_move = true;
                        }
                        break;
                    }
    
                }
            }
        }
        return is_any_tile_move;
    }
    
    moveDown(field) {
        let is_any_tile_move = false;
        for (let i = this.cells - 2; i >= 0; --i) {
            for (let j = 0; j < this.cells; ++j) {
                if (this.cells_list[i][j] == undefined) {
                    continue;
                }
                let ci = i + 1;
                for (; ; ++ci) {
                    if (ci >= this.cells) {
                        this.cells_list[ci - 1][j] = this.cells_list[i][j];
                        this.cells_list[i][j] = undefined;
                        is_any_tile_move = true;
                        break;
                    }
                    if (this.cells_list[ci][j] != undefined) {
                        if (ci - 1 != i && this.cells_list[ci][j] != this.cells_list[i][j]) {
                            this.cells_list[ci - 1][j] = this.cells_list[i][j];
                            this.cells_list[i][j] = undefined;
                            is_any_tile_move = true;
                        } else if (this.cells_list[ci][j] == this.cells_list[i][j]) {
                            this.cells_list[ci][j] = '' + 2 * (+this.cells_list[i][j]);
                            this.cells_list[i][j] = undefined;
                            is_any_tile_move = true;
                        }
                        break;
                    }
    
                }
            }
        }
        return is_any_tile_move;
    }
}