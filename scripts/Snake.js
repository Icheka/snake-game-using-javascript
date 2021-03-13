class Snake {
    constructor(box) {
        this.snake = [];
        this.snake.push({
            x: 8 * box,
            y: 8 * box
        });
        this.direction = "right"; // direction to turn when snake is just rendered
    }

    // set
    changeDirection(key) {
        const { direction } = this;

        switch (key) {
            case 37:
                if (direction !== "right") this.direction = "left";
                break;
            case 38:
                if (direction !== "down") this.direction = "up";
                break;
            case 39:
                if (direction !== "left") this.direction = "right";
                break;
            case 40:
                if (direction !== "up") this.direction = "down";
                break;
            default:
                break;
        }
    }

    // get
    getCoords() {
        return this.snake[0];
    }

    // set
    move(coords) {
        this.snake.unshift(coords);
    }
}

class Game {
    constructor() {
        this.canvas = document.getElementById("window");
        this.context = this.canvas.getContext("2d");
        this.box = 32; // size of individual square unit of Snake in pixels
        
        this.snake = new Snake(this.box);
        this.snake_color = "red";

        this.food = {
            x: Math.floor(Math.random() * 15 + 1) * this.box,
            y: Math.floor(Math.random() * 15 + 1) * this.box
        };
        this.food_color = "darkgreen";

        app.game_state_toggle_text = "Pause";
        this.gameLoop = setInterval(() => {
            this.start();
        }, 110);

        document.addEventListener("keydown", e => this.updateSnakePosition(e));
    }

    createBG(color) {
        this.context.fillStyle = color || "#efefef";
        this.context.fillRect(0, 0, 16 * this.box, 16 * this.box);
    }

    drawSnake() {
        let { snake } = this.snake;

        for (let i = 0; i < snake.length; i++) {
            this.context.fillStyle = this.snake_color;
            this.context.fillRect(snake[i].x, snake[i].y, this.box, this.box);
        }

        this.snake.snake = snake;
    }

    drawFood() {
        this.context.fillStyle = this.food_color;
        this.context.fillRect(
            this.food.x,
            this.food.y,
            this.box,
            this.box
        );
    }

    updateSnakePosition({ keyCode }) {
        switch (keyCode) {
            case 32:
                this.toggleGameState();
                break;
        
            default:
                this.snake.changeDirection(keyCode);
                break;
        }
    }

    start() {
        let { snake } = this.snake;

        if (snake[0].x > 15 * this.box && this.snake.direction == "right") snake[0].x = 0;
        if (snake[0].x < 0 && this.snake.direction == 'left') snake[0].x = 16 * this.box;
        if (snake[0].y > 15 * this.box && this.snake.direction == "down") snake[0].y = 0;
        if (snake[0].y < 0 && this.snake.direction == 'up') snake[0].y = 16 * this.box;

        for (let i = 1; i < snake.length; i++) {
            if (snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
                this.gameOver();
            };
        };
        if ((snake[0].x == this.food.x) && (snake[0].y == this.food.y)) this.gameOver();

        this.snake.snake = snake;

        this.gameOn = true;
        this.createBG("white");
        this.drawSnake();
        this.drawFood();

        let { x, y } = this.snake.getCoords();

        switch (this.snake.direction) {
            case "right":
                x += this.box;
                break;
            case "left":
                x -= this.box;
                break;
            case "up":
                y -= this.box;
                break;
            case "down":
                y += this.box;
                break;
            default:
                break;
        }

        if ((x == this.food.x) && (y == this.food.y)) {
            this.food.x = Math.floor(Math.random() * 15 + 1) * this.box;
            this.food.y = Math.floor(Math.random() * 15 + 1) * this.box;
        } else {
            snake.pop();
        }

        const coords = {x, y};
        this.snake.snake = snake;
        this.snake.move(coords);
    }

    gameOver() {
        clearInterval(this.gameLoop);
        this.gameOn = false;
        app.game_state_toggle_text = "Play";
        alert('Game Over :(');
    }

    toggleGameState() {
        switch(this.gameOn) {
            case true:
                clearInterval(this.gameLoop);
                break;
            case false:
                this.gameLoop = setInterval(() => {
                    this.start();
                }, 100);
                break;
        }
        this.gameOn = !this.gameOn;
    }
}

const app = {
    title: "Snake Game",
    game_state_toggle_text: "Play/Pause"
};

const VIEW = `
<div id="board">
    <div class="sidebar meta-sidebar">
        <h1 class="app-title">${app.title}</h1>
    </div>
    <div class="app-wrapper">
        <canvas id="window" width="512" height="512"></canvas>        
    </div>
    <div class="sidebar links-sidebar">
        &nbsp;
        <div class="game-toggler-wrapper">
            <button onclick="game.toggleGameState()" class="game-state-toggler">
                ${app.game_state_toggle_text}
            </button>
            <div id="footer">
                Made with ❤️ <br />
                Icheka Ozuru (@c0debeast_)
            </div>
        </div>
    </div>
</div>
<div class="overlay-on-mobile">
    <h1>
    😞 <br />
    Unfortunately, we do not support mobile browsers at this time.
    Switch to desktop to play Snake Game-o.
    </h1>
    <div class="github-btn-wrapper">
        <a class="github-btn" href="https://github.com/Icheka/snake-game-using-javascript">View the code on GitHub</a>
    </div>
</div>
`;
document.getElementsByTagName("body")[0].innerHTML = VIEW;

// SIDEBAR COMPONENT
class Sidebar {
    constructor() {
        this.links = {
            Author: {
                name: "Icheka Ozuru",
                link: "https://github.com/icheka"
            },
            GitHub: {
                name: "View the source code on GitHub",
                link: "https://github.com/Icheka/snake-game-using-javascript"
            }
        };
    }

    render(element) {
        element = document.getElementsByClassName(element)[0];
        const result = Object.keys(this.links).map(link => {
            let a = document.createElement("a");
            a.href = this.links[link].link;
            a.innerText = link;
            a.title = this.links[link].name;
            a.className = "sidebar-link"

            return a;
        });

        for (const R of result) {
            element.append(R);
        }
    }
}

new Sidebar().render("links-sidebar");
const game = new Game();
