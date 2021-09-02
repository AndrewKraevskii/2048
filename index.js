const field_size_px = 700;
const field_size_cells = 4;
const font_size = 100;
const start_numbers_count = 2;

let field = new Array(field_size_cells)
for (let i = 0; i < field.length; ++i) {
    field[i] = new Array(field_size_cells)
}


function draw() {
    var canvas = document.getElementById('game_canvas');
    canvas.width = field_size_px;
    canvas.height = field_size_px;
    var ctx = canvas.getContext('2d');

    let box_size = field_size_px / field_size_cells;
    for (let i = 0; i < field_size_cells; ++i) {
        for (let j = 0; j < field_size_cells; ++j) {
            ctx.strokeRect(box_size * j, box_size * i, box_size, box_size)
            ctx.font = `${font_size}px sans`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${field[i][j] || ""}`, box_size * j + box_size / 2, box_size * i + box_size / 2);
        }
    }
}

function addNumber() {
    let cell_number = undefined;
    while (true) {
        cell_number = Math.floor(Math.random() * field_size_cells * field_size_cells)
        if (field[Math.floor(cell_number / field_size_cells)][cell_number % field_size_cells] == undefined) {
            field[Math.floor(cell_number / field_size_cells)][cell_number % field_size_cells] = Math.random() < 0.7 ? '2' : '4';
            break;
        }
    }
}


function moveLeft() {
    for (let i = 0; i < field_size_cells; ++i) {
        for (let j = 1; j < field_size_cells; ++j) {
            if (field[i][j] == undefined) {
                continue;
            }
            let cj = j - 1;
            for (; ; --cj) {
                if (cj < 0) {
                    field[i][cj + 1] = field[i][j];
                    field[i][j] = undefined;
                    break;
                }
                if (field[i][cj] != undefined) {
                    if (cj + 1 != j && field[i][cj] != field[i][j]) {
                        field[i][cj + 1] = field[i][j];
                        field[i][j] = undefined;
                    }
                    else if (field[i][cj] == field[i][j]){
                        field[i][cj] = '' + 2 * (+field[i][j]);
                        field[i][j] = undefined;
                    }
                    break;
                }
                
            }
        }
    }
}

function moveUp() {
    for (let i = 1; i < field_size_cells; ++i) {
        for (let j = 0; j < field_size_cells; ++j) {
            if (field[i][j] == undefined) {
                continue;
            }
            let ci = i - 1;
            for (; ; --ci) {
                if (ci < 0) {
                    field[ci + 1][j] = field[i][j];
                    field[i][j] = undefined;
                    break;
                }
                if (field[ci][j] != undefined) {
                    if (ci + 1 != i && field[ci][j] != field[i][j]) {
                        field[ci + 1][j] = field[i][j];
                        field[i][j] = undefined;
                    }
                    else if (field[ci][j] == field[i][j]){
                        field[ci][j] = '' + 2 * (+field[i][j]);
                        field[i][j] = undefined;
                    }
                    break;
                }
                
            }
        }
    }
}

function moveRight() {
    for (let i = 0; i < field_size_cells; ++i) {
        for (let j = field_size_cells - 2; j >= 0; --j) {
            if (field[i][j] == undefined) {
                continue;
            }
            let cj = j + 1;
            for (; ; ++cj) {
                if (cj >= field_size_cells) {
                    field[i][cj - 1] = field[i][j];
                    field[i][j] = undefined;
                    break;
                }
                if (field[i][cj] != undefined) {
                    if (cj - 1 != j && field[i][cj] != field[i][j]) {
                        field[i][cj - 1] = field[i][j];
                        field[i][j] = undefined;
                    }
                    else if (field[i][cj] == field[i][j]){
                        field[i][cj] = '' + 2 * (+field[i][j]);
                        field[i][j] = undefined;
                    }
                    break;
                }
                
            }
        }
    }
}

function moveDown() {
    for (let i = field_size_cells - 2; i >= 0; --i) {
        for (let j = 0; j < field_size_cells; ++j) {
            if (field[i][j] == undefined) {
                continue;
            }
            let ci = i + 1;
            for (; ; ++ci) {
                if (ci >= field_size_cells) {
                    field[ci - 1][j] = field[i][j];
                    field[i][j] = undefined;
                    break;
                }
                if (field[ci][j] != undefined) {
                    if (ci - 1 != i && field[ci][j] != field[i][j]) {
                        field[ci - 1][j] = field[i][j];
                        field[i][j] = undefined;
                    }
                    else if (field[ci][j] == field[i][j]){
                        field[ci][j] = '' + 2 * (+field[i][j]);
                        field[i][j] = undefined;
                    }
                    break;
                }
                
            }
        }
    }
}

document.addEventListener('keydown', (event) => {
    switch (event.code) {
        case 'ArrowLeft':
            moveLeft();
            break;
        case 'ArrowUp':
            moveUp();
            break;
        case 'ArrowRight':
            moveRight();
            break;
        case 'ArrowDown':
            moveDown();
            break;
        default:
            return;

    }
    addNumber();
    draw();
})



for (let i = 0; i < start_numbers_count; ++i) {
    addNumber();
}

