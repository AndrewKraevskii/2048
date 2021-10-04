const field_size_px = Math.floor(Math.min(window.screen.width, window.screen.height) * 0.7);
const field_size_cells = 4;
const cell_margin = 7 / 700 * field_size_px;
const start_numbers_count = 2;
const font_size = 2 / 700 * field_size_px;

background = {
    '2': { color: '#eee4da', font_size: 55 },
    '4': { color: '#eee1c9', font_size: 55 },
    '8': { color: '#f3b27a', font_size: 55 },
    '16': { color: '#f69664', font_size: 55 },
    '32': { color: '#f77c5f', font_size: 55 },
    '64': { color: '#f75f3b', font_size: 55 },
    '128': { color: '#edd073', font_size: 45 },
    '256': { color: '#edcc62', font_size: 45 },
    '512': { color: '#edc950', font_size: 45 },
    '1024': { color: '#edc53f', font_size: 35 },
    '2048': { color: '#edc22e', font_size: 35 },
    'super': { color: '#3c3a33', font_size: 30 },
}

let field = new Array(field_size_cells)
for (let i = 0; i < field.length; ++i) {
    field[i] = new Array(field_size_cells)
}


/**
 * Draws a rounded rectangle using the current state of the canvas.
 * If you omit the last three params, it will draw a rectangle
 * outline with a 5 pixel border radius
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 * @param {Number} [radius = 5] The corner radius; It can also be an object 
 *                 to specify different radii for corners
 * @param {Number} [radius.tl = 0] Top left
 * @param {Number} [radius.tr = 0] Top right
 * @param {Number} [radius.br = 0] Bottom right
 * @param {Number} [radius.bl = 0] Bottom left
 * @param {Boolean} [fill = false] Whether to fill the rectangle.
 * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
 */
function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof stroke === 'undefined') {
        stroke = true;
    }
    if (typeof radius === 'undefined') {
        radius = 5;
    }
    if (typeof radius === 'number') {
        radius = { tl: radius, tr: radius, br: radius, bl: radius };
    } else {
        var defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
        for (var side in defaultRadius) {
            radius[side] = radius[side] || defaultRadius[side];
        }
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) {
        ctx.fill();
    }
    if (stroke) {
        ctx.stroke();
    }

}

function draw() {
    var canvas = document.getElementById('game_canvas');
    canvas.width = field_size_px;
    canvas.height = field_size_px;
    var ctx = canvas.getContext('2d');

    let box_size = field_size_px / field_size_cells;

    ctx.fillStyle = '#bbada0';
    ctx.fillRect(0, 0, field_size_px, field_size_px);
    for (let i = 0; i < field_size_cells; ++i) {
        for (let j = 0; j < field_size_cells; ++j) {
            if (field[i][j]) {
                ctx.fillStyle = background[field[i][j]]?.color || background['super']?.color;
                roundRect(ctx, box_size * j + cell_margin, box_size * i + cell_margin,
                    box_size - 2 * cell_margin, box_size - 2 * cell_margin,
                    1 / 45 * field_size_px, true, false)
                ctx.font = `${(background[field[i][j]]?.font_size || background['super'].font_size) * font_size}px sans`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = 'black';
                ctx.fillText(`${field[i][j]}`, box_size * j + box_size / 2, box_size * i + box_size / 2);
            }
            else {
                ctx.fillStyle = 'rgba(238, 228, 218, 0.35)';
                roundRect(ctx, box_size * j + cell_margin, box_size * i + cell_margin,
                    box_size - 2 * cell_margin, box_size - 2 * cell_margin,
                    1 / 45 * field_size_px, true, false)

            }
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
    let is_any_tile_move = false;
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
                    is_any_tile_move = true;
                    break;
                }
                if (field[i][cj] != undefined) {
                    if (cj + 1 != j && field[i][cj] != field[i][j]) {
                        field[i][cj + 1] = field[i][j];
                        field[i][j] = undefined;
                        is_any_tile_move = true;
                    }
                    else if (field[i][cj] == field[i][j]) {
                        field[i][cj] = '' + 2 * (+field[i][j]);
                        field[i][j] = undefined;
                        is_any_tile_move = true;
                    }
                    break;
                }

            }
        }
    }
    return is_any_tile_move;
}

function moveUp() {
    let is_any_tile_move = false;
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
                    is_any_tile_move = true;
                    break;
                }
                if (field[ci][j] != undefined) {
                    if (ci + 1 != i && field[ci][j] != field[i][j]) {
                        field[ci + 1][j] = field[i][j];
                        field[i][j] = undefined;
                        is_any_tile_move = true;
                    }
                    else if (field[ci][j] == field[i][j]) {
                        field[ci][j] = '' + 2 * (+field[i][j]);
                        field[i][j] = undefined;
                        is_any_tile_move = true;
                    }
                    break;
                }

            }
        }
    }
    return is_any_tile_move;
}

function moveRight() {
    let is_any_tile_move = false;
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
                    is_any_tile_move = true;
                    break;
                }
                if (field[i][cj] != undefined) {
                    if (cj - 1 != j && field[i][cj] != field[i][j]) {
                        field[i][cj - 1] = field[i][j];
                        field[i][j] = undefined;
                        is_any_tile_move = true;
                    }
                    else if (field[i][cj] == field[i][j]) {
                        field[i][cj] = '' + 2 * (+field[i][j]);
                        field[i][j] = undefined;
                        is_any_tile_move = true;
                    }
                    break;
                }

            }
        }
    }
    return is_any_tile_move;
}

function moveDown() {
    let is_any_tile_move = false;
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
                    is_any_tile_move = true;
                    break;
                }
                if (field[ci][j] != undefined) {
                    if (ci - 1 != i && field[ci][j] != field[i][j]) {
                        field[ci - 1][j] = field[i][j];
                        field[i][j] = undefined;
                        is_any_tile_move = true;
                    }
                    else if (field[ci][j] == field[i][j]) {
                        field[ci][j] = '' + 2 * (+field[i][j]);
                        field[i][j] = undefined;
                        is_any_tile_move = true;
                    }
                    break;
                }

            }
        }
    }
    return is_any_tile_move;
}

document.addEventListener('keydown', (event) => {
    move(event.code);
})

const container = document;
const listener = SwipeListener(container);
container.addEventListener('swipe', function (event) {
    console.log(event);
//   if(event.)
    const dir = event.detail.directions;
    move_list = ['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'][1 * dir.top + 2 * dir.right + 3 * dir.bottom];
    move(move_list);
});

for (let i = 0; i < start_numbers_count; ++i) {
    addNumber();
}

function move(direction) {
    let need_new_number = false;
    switch (direction) {
        case 'ArrowLeft':
            need_new_number = moveLeft();
            break;
        case 'ArrowUp':
            need_new_number = moveUp();
            break;
        case 'ArrowRight':
            need_new_number = moveRight();
            break;
        case 'ArrowDown':
            need_new_number = moveDown();
            break;
        default:
            return;

    }
    if (need_new_number) {
        addNumber();
        draw();
    }
}

