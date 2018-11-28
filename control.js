$('.btn-secondary').on('click', (e) => {
    $('.btn-secondary').css('background-color', '#000');
    $(e.target).css('background-color', 'rgba(0, 0, 255, 0.7');
    $(e.target).css('color', 'white');
    changeDifficulty(e.target.value);
});

$('#reset').on('click', () => {
    changeDifficulty('reset');
});
$('#pause').on('click', () => {
    myGame.gameStopped = !myGame.gameStopped;
});

$('#options').on('click', () => {
    myGame.gameStopped = true;
    $('#options-container').modal();
});

$('.modal input').on('click', (e) => {
    var type = e.target.name;
    var value = e.target.value;
    myGame.settings.change(type, value);
});

$('.jscolor').on('change', (e) => {
    myGame.settings.change('snakeColor', e.target.style.backgroundColor);
});

function changeDifficulty(value){   
    
    switch(value){
        case 'easy':
            fps = 5;
        break;

        case 'normal':
            fps = 8;
        break;

        case 'hard':
            fps = 12;
        break;

        case 'extreme':
            fps = 16;
        break;

        case 'custom':
            fps = $('#custom-value').val();
        break;

        // Unknown behavior case
        default:
            // Im using this as a reset function because im lazy, don't judge
        break;
    
    }
    console.log(fps);

    myGame = new Game(blockSize, c);
    clearInterval(frames);
    frames = setInterval(function(){
        requestAnimationFrame(animate);
    }, 1000 / fps);
}