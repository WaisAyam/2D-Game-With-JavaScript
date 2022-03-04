var canvas,
ctx,
HEIGHT,
WIDTH,
frames = 0,
maxPulses = 2,
speed = 3,
StatusCurrent,


states = {
    play: 0,
    playing: 1,
    i_lost: 2
},

overTake = {
    y: 550,
    height: 50,
    color: '#020202 ',

    ground: function(){
        ctx.fillStyle = this.color;
        ctx.fillRect(0, this.y, WIDTH, this.height);
    }
},

user = {
    x: 50,
    y: 0,
    height: 50,
    width: 50,
    color: '#D46704',
    gravity: 1.2,
    speed: 0,
    howMuchGoHigh: 22,
    qntPulses: 0,

    userOnGround: function(){
        this.speed += this.gravity;
        this.y += this.speed;

        if(this.y > overTake.y - this.height && StatusCurrent != states.i_lost){
            this.y = overTake.y - this.height;

            this.qntPulses = 0;

            this.speed = 0;
        }
    },

    jump: function(){
    
        if(this.qntPulses < maxPulses){ 
            this.speed = -this.howMuchGoHigh;
            this.qntPulses++;
        }
    },

    designUser: function(){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
},

enemies = { 
    arrays: [],
    colors: ["#D80000", "#BE00D8", "#2B00C9", "#0B9200", "#7E9200", "#926700", "#923600", "#920000"],
    tempoInsere: 0,

    insere: function(){
        this.arrays.push({
            x: WIDTH,
            width: 30 + Math.floor(20 * Math.random()),
            height: 30 + Math.floor(120 * Math.random()),
            color: this.colors[Math.floor(8 * Math.random())]
        });

        this.tempoInsere = 80 + Math.floor(21 * Math.random()); 
    },

    animateEneme: function(){

        if(this.tempoInsere == 0){
            this.insere();
        }else{
            this.tempoInsere--;
        }

        for (var i = 0, too = this.arrays.length; i < too; i++){
            var obs = this.arrays[i];
            obs.x -= speed;

            //if user hate the enemies//8
            if (user.x < obs.x + obs.width &&
                user.x + user.width >= obs.x &&
                user.y + user.height >= overTake.y - obs.height){
                    StatusCurrent = states.i_lost;
                }

            if(obs.x <= -obs.width){
                this.arrays.splice(i, 1);
                too--;
                i--;
            }
        }
    },

    clean: function(){
        this.arrays = [];
    },

    enemiesOnGround: function(){
        for(var i = 0, too = this.arrays.length; i < too; i++){
            var obs = this.arrays[i];
            ctx.fillStyle = obs.color;
            ctx.fillRect(obs.x, overTake.y - obs.height, obs.width, obs.height);
        }
    }
};

function click(e){
    //console.log(e);

    //user.jump();

    if(StatusCurrent == states.playing){ 
        user.jump();
    }
    else if(StatusCurrent == states.play){
        StatusCurrent = states.playing;
    }
    else if(StatusCurrent == states.i_lost){
        StatusCurrent = states.play;

        user.speed = 0;
        user.y = 0;
    }
}

function main(){
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;

    if(WIDTH >= 500){
        WIDTH = 600;
        HEIGHT = 600;
    }

    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    canvas.style.border = '3px solid #000';
    document.body.appendChild(canvas);

    document.addEventListener('click', click);

    StatusCurrent = states.play;

    stem();
}

function stem(){
    update();
    draw();
    window.requestAnimationFrame(stem);
}

function update(){
    frames++;

    user.userOnGround();

    if(StatusCurrent == states.playing){
        enemies.animateEneme();
    }
    else if(StatusCurrent == states.i_lost){
        enemies.clean();
    }
}

function draw(){
    ctx.fillStyle = '#63C8FA';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    if(StatusCurrent == states.play){
        ctx.fillStyle = '#30E129';
        ctx.fillRect(WIDTH / 2 - 50, HEIGHT / 2 - 50, 100, 100);
    }
    else if(StatusCurrent == states.i_lost){ 
        ctx.fillStyle = "#F95C4F"; 
        ctx.fillRect(WIDTH / 2 - 50, HEIGHT / 2 - 50, 100, 100); 
    }
    else if(StatusCurrent == states.playing){
        enemies.enemiesOnGround();
    }
    
    overTake.ground();
    //enemies.enemiesOnGround();
    user.designUser();
}

main();