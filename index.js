const field_size_px = Math.floor(Math.min(window.innerWidth, window.innerHeight) * .8);
const field_size_cells = 4;
const cell_margin = 7 / 700 * field_size_px;
const start_numbers_count = 2;
const font_size = 2 / 700 * field_size_px;

const preview = document.querySelector('.preview');
const button = document.querySelector('.preview > button');
const input = document.querySelector('.preview > input');
const canvas_div = document.querySelector('.game');
const canvas = document.querySelector('.game_canvas');

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



function set_channel_name_from_url() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const channel_name = urlParams.get('q');
    if (channel_name) {
        input.value = channel_name;
    }
}

set_channel_name_from_url();


let field = new Field(field_size_px, field_size_cells, cell_margin, start_numbers_count, font_size);





document.addEventListener('keydown', (event) => {
    move(field, event.code);
})

const container = document;
const listener = SwipeListener(container);
container.addEventListener('swipe', function (event) {
    console.log(event);
    //   if(event.)
    const dir = event.detail.directions;
    const move_direction = ['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'][1 * dir.top + 2 * dir.right + 3 * dir.bottom];
    move(move_direction);
});

button.addEventListener('click', (event) => {
    const channel_name = input.value.trim();

    canvas_div.hidden = false;
    preview.style.display = 'none';


    if (channel_name !== '') {
        console.log()
        const client = new tmi.Client({ channels: [channel_name] });
        client.on('message', (channel, tags, message, self) => {
            const lower = message.toLowerCase();
            for (let x of ['→', 'right', 'вправо', 'право']) {
                if (lower.includes(x))
                    return move('ArrowRight')
            }
            for (let x of ['↑', 'up', 'top', 'верх', 'вверх']) {
                if (lower.includes(x))
                    return move('ArrowUp')
            }
            for (let x of ['←', 'left', 'влево', 'лево']) {
                if (lower.includes(x))
                    return move('ArrowLeft')
            }
            for (let x of ['↓', 'down', 'bottom', 'вниз', 'низ']) {
                if (lower.includes(x))
                    return move('ArrowDown')
            }
        });
        client.connect().catch(console.error);
    }
    field.draw(canvas);
})



function move(field, direction) {
    let need_new_number = false;
    switch (direction) {
        case 'ArrowLeft':
            need_new_number = field.moveLeft();
            break;
        case 'ArrowUp':
            need_new_number = field.moveUp();
            break;
        case 'ArrowRight':
            need_new_number = field.moveRight();
            break;
        case 'ArrowDown':
            need_new_number = field.moveDown();
            break;
        default:
            return;

    }
    if (need_new_number) {
        field.addNumber();
        field.draw(canvas);
    }
}

field.draw(canvas);