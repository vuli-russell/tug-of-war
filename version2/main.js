//functions
const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};

const startGame = (isNewGame) => {
    if(isNewGame){
    
        //game options stuff
        document.querySelectorAll("[name='input-mode']").forEach(radio => {
            if (radio.checked){
                gameData.inputMode = radio.id;
            }
        });
        document.querySelectorAll("[name='movement-mode']").forEach(radio => {
            if (radio.checked){
                gameData.movementMode = radio.id;
            }
        });
        if(!gameData.inputMode || !gameData.movementMode){
            return
        }
        newGameContent.style.display = 'none';
        //getnames
        gameData.player1.name = document.querySelector("[name='p-one-name']").value ? document.querySelector("[name='p-one-name']").value : 'player 1';
        gameData.player2.name = document.querySelector("[name='p-two-name']").value ? document.querySelector("[name='p-two-name']").value : 'player 2';
    } else {
        endGameContent.style.display = 'none';
    }
    gameData.playing = true;
    gameData.theTugged.xPosition = canvas.width/2;
    gameData.theTugged.speedLeft = 0;
    gameData.theTugged.speedRight = 0;
    if(gameData.inputMode === 'multi-button'){
        gameData.player1.updateRequiredButton();
        gameData.player2.updateRequiredButton();
    }

};

const endGame = (winner) => {
    gameData.playing= false;
    winner.wins ++;

    endGameContent.children[0].innerText = `${winner.name} is the winner!`

    endGameContent.children[1].innerText = `scores are: \n ${gameData.player1.name}| ${gameData.player1.wins}:${gameData.player2.wins} |${gameData.player2.name}`

    endGameContent.style.display = 'flex';
}



const animate = () => {
    requestAnimationFrame(animate); 
    canvasContext.clearRect(0,0,canvas.width,canvas.height);
    if(gameData.playing){
        //draw finish lines
        gameData.drawFinishLines(canvasContext);
        //draw obj
        gameData.theTugged.draw(canvasContext);
        //draw required buttons
        gameData.drawRequiredButtons(canvasContext);

        //update object position in speed mode
        gameData.theTugged.updatePostion();

        //check if player has won
        if(gameData.theTugged.xPosition - gameData.theTugged.width/2 < gameData.player1.finishPos){
            endGame(gameData.player1);
        };

        if(gameData.theTugged.xPosition + gameData.theTugged.width/2 > gameData.player2.finishPos){
            endGame(gameData.player2)
        };

    }
};

//page start

const canvas = document.querySelector('canvas');
resizeCanvas();

const canvasContext = canvas.getContext('2d');

const newGameContent = document.querySelector('.new-game');

const newGameStartButton = document.querySelector('.new-game__button--start');

const endGameContent = document.querySelector('.end-game');

const playAgainStartButton = document.querySelector('.end-game__button--start');

let gameData = {
    player1: {
        name: 'player 1',
        wins: 0,
        finishPos: canvas.width*0.2,
        requiredButton: ['a','./assets/left-arrow.svg'],
        requiredButtonOptions: [['w','./assets/up-arrow.svg'],['s','./assets/down-arrow.svg'],['a','./assets/left-arrow.svg'],['d','./assets/right-arrow.svg']],
        updateRequiredButton: function(){
            this.requiredButton = this.requiredButtonOptions[Math.floor(Math.random()*this.requiredButtonOptions.length)];
        },
        arrow: {
            x: canvas.width * 0.1 - 50,
            y: canvas.height * 0.8,
            width: 100,
            height: 100
        }
    },
    player2: {
        name: 'player 2',
        wins: 0,
        finishPos: canvas.width*0.8,
        requiredButton:['ArrowRight','./assets/right-arrow.svg'],
        requiredButtonOptions: [['ArrowUp','./assets/up-arrow.svg'],['ArrowDown','./assets/down-arrow.svg'],['ArrowLeft','./assets/left-arrow.svg'],['ArrowRight','./assets/right-arrow.svg']],
        updateRequiredButton: function(){
            this.requiredButton = this.requiredButtonOptions[Math.floor(Math.random()*this.requiredButtonOptions.length)];
        },
        arrow: {
            x: canvas.width * 0.9 - 50,
            y: canvas.height * 0.8,
            width: 100,
            height: 100
        }
    },
    theTugged: {
        xPosition: canvas.width/2,
        yPosition: canvas.height/2,
        height: 100,
        width: 100,

        //for speed move
        speedLeft: 0,
        speedRight: 0,
        updatePostion: function(){
            this.xPosition = this.xPosition + this.speedRight - this.speedLeft;
        },

        //for jump move
        jumpDistance: canvas.width/40,
        jumpLeft: function(){
            this.xPosition -= this.jumpDistance;
        },
        jumpRight: function(){
            this.xPosition += this.jumpDistance;
        },
        draw: function(c){
            c.fillStyle = 'black';
            c.fillRect(this.xPosition-this.width/2,this.yPosition-this.height/2,this.width,this.height);
        }
    },
    lastWinner: null,
    playing: false,
    drawFinishLines: function(c){
        c.beginPath();
        c.setLineDash([50,50]);
        c.moveTo(this.player1.finishPos,0);
        c.lineTo(this.player1.finishPos,canvas.height);
        c.moveTo(this.player2.finishPos,0);
        c.lineTo(this.player2.finishPos,canvas.height);
        c.lineWidth = 20;
        c.strokeStyle = 'black';
        c.stroke();
    },
    drawRequiredButtons: function(c){
        [this.player1,this.player2].forEach(player => {
            img = new Image();
            img.src = player.requiredButton[1];
            c.drawImage(img, player.arrow.x, player.arrow.y, player.arrow.width, player.arrow.height);
        });
    },
    inputMode: null,
    movementMode: null
};

//event listeners
window.addEventListener('resize',resizeCanvas);

newGameStartButton.addEventListener('click',()=>{startGame(true)});

playAgainStartButton.addEventListener('click',()=>{startGame(false)});

//button inputs
document.addEventListener('keydown',(e)=>{
    if(gameData.playing){
        switch(e.key){
            case gameData.player1.requiredButton[0]:
                if(gameData.playing){
                    //new button if multi button mode
                    if(gameData.inputMode === 'multi-button'){
                        gameData.player1.updateRequiredButton();
                    }

                    //jump or update speed on correct press
                    if(gameData.movementMode === 'jump'){
                        gameData.theTugged.jumpLeft();
                    } else if(gameData.movementMode === 'speed'){
                        gameData.theTugged.speedLeft +=1;
                    }
                }
                break;
            case gameData.player2.requiredButton[0]:
                if(gameData.playing){
                    if(gameData.inputMode === 'multi-button'){
                        gameData.player2.updateRequiredButton();
                    }

                    if(gameData.movementMode === 'jump'){
                        gameData.theTugged.jumpRight();
                    } else if(gameData.movementMode === 'speed'){
                        gameData.theTugged.speedRight +=1;
                    }
                }
            default:
                break;
        }
    }
});

//
animate();