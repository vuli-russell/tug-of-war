const resizeCanvas = (canvas) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};

const drawTugObj = (obj) => {
    c.beginPath();
    c.fillStyle = 'black';
    c.fillRect(obj.xPosition-0.5*obj.width,obj.yPosition-0.5*obj.height,obj.width,obj.height);    
};

const gameOver = (winner,loser) => {
    winner.wins ++;
    winner.winStreak = winner.winStreak > 0 ? winner.winStreak++ : 1;
    loser.winStreak = 0;
    gameData.playing = false;
    gameData.lastWinner = winner;
}

const drawGameOverScreen = () => {
    c.font = `${canvas.height * 0.05}px sans-serif`;
    c.textAlign = 'center';
    c.textBaseline = 'middle'
    c.fillText(`${gameData.lastWinner.name} is the Winner`,canvas.width * 0.5,canvas.height * 0.1,canvas.width*0.8);
    c.fillText(``,canvas.width * 0.5,canvas.height * 0.2),canvas.width*0.8;
    c.fillText(`Current scores are ${gameData.playerOne.name} - ${gameData.playerOne.wins} : ${gameData.playerTwo.wins} - ${gameData.playerTwo.name}`,canvas.width * 0.5,canvas.height * 0.3,canvas.width*0.8);

    buttonsData.playAgain.draw();
};

const newGame = () => {
    gameData.playing = true;
    gameData.tugObj.xPosition = window.innerWidth / 2;
};

const clickEvents = (e) => {

    //buttons for game over screen
    if(!gameData.playing){
        if(checkClickHit(e,buttonsData.playAgain)){
            newGame();
        }
    }
}

const drawButton = (button) => {
    c.fillRect(button.xPosition,button.yPosition,button.width,button.height);
    c.font = `${button.height*0.5}px sans-serif`;
    c.textAlign = 'center';
    c.textBaseline = 'middle'
    c.fillStyle = 'red';
    c.fillText(button.text,button.xPosition+button.width*0.5,button.yPosition+button.height*0.5,button.width*0.6);
};

//checks if event click landed on button
const checkClickHit = (event,button) => {
    if(
        event.x > button.xPosition &&
        event.x < button.xPosition + button.width &&
        event.y > button.yPosition &&
        event.y < button.yPosition + button.height
    ){
        return true;
    }
    return false;
};

const animate = () => {
    requestAnimationFrame(animate);
    //clear canvas
    c.clearRect(0,0,canvas.width,canvas.height);

    //draw object
    drawTugObj(gameData.tugObj);

    //check if game is won
    if (gameData.playing){
        if(gameData.tugObj.xPosition < 200){
            gameOver(gameData.playerOne,gameData.playerTwo);
            
    
        } else if(gameData.tugObj.xPosition > canvas.width-200){
            gameOver(gameData.playerTwo,gameData.playerOne);
        }
    } else{
        drawGameOverScreen();
    }
};

//initial Data

let gameData = {
    playerOne: {
        name: 'Player One',
        wins: 0,
        winStreak: 0
    },
    playerTwo: {
        name: 'Player Two',
        wins: 0,
        winStreak: 0
    },
    tugObj: {
        xPosition: window.innerWidth / 2,
        yPosition: window.innerHeight / 2,
        height: window.innerHeight * 0.2,
        width: window.innerHeight * 0.2,
        speed: 10,
        moveLeft: function(){
            this.xPosition -= this.speed;
        },
        moveRight: function(){
            this.xPosition += this.speed;
        }
    },
    playing: true,
    lastWinner: null
};

let buttonsData = {
    playAgain: {
        xPosition: window.innerWidth*0.2,
        yPosition: window.innerHeight*0.8,
        height: window.innerHeight*0.1,
        width: window.innerWidth*0.2,
        text: 'Play Again',
        color: 'white',
        textColor: 'black',
        draw: function(){
            drawButton(this)
        }
    }
}

const canvas = document.querySelector('canvas');

const c = canvas.getContext('2d');

resizeCanvas(canvas);

animate();

addEventListener('keydown',(e) => {
    if (gameData.playing){
        switch(e.key){
            case 'ArrowLeft':
                gameData.tugObj.moveLeft()
                break;
            case 'ArrowRight':
                gameData.tugObj.moveRight();
                break;
            default:
                break;
        }
    }
});

window.addEventListener('resize',()=>{resizeCanvas(canvas)});

window.addEventListener('click',clickEvents);



