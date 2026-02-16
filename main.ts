namespace SpriteKind {
    export const Pipe = SpriteKind.create()
}
// ask the player if the ycan jump high, determine game difficulty
function determineJump () {
    can = game.ask("Can you jump?")
    if (!(can)) {
        game.gameOver(false)
    }
    jump = game.ask("Can you jump really high?")
    if (jump) {
        return -2.5
    }
    return -2.3
}
// jump logic
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    vy = jumpHeight
})
// reusable function to kill player and display a message
function die () {
    game.splash("You died!", "Score: " + info.score())
    addScore(info.score())
    alive = false
    game.splash("PRESS A TO PLAY AGAIN")
}
function displayScores () {
    Object.keys(scores).forEach((key) => {
        const value = scores[key]
        text += `${key}....${value}\n`
    })
game.showLongText(text, DialogLayout.Full)
}
// handle collision with pipes
sprites.onOverlap(SpriteKind.Player, SpriteKind.Pipe, function (player2, pipe) {
    die()
})
// rest the pipes and the player and ground to their original poistions and velocity
function reset () {
    for (let p of sprites.allOfKind(SpriteKind.Pipe)) {
        p.destroy()
    }
    pipes = [[spawnPipe(160, 30, true), spawnPipe(160, 80, false)], [spawnPipe(220, 30, true), spawnPipe(220, 80, false)], [spawnPipe(280, 30, true), spawnPipe(280, 80, false)]]
    g12 = sprites.create(assets.image`myImage2`, SpriteKind.Pipe)
    g12.setPosition(80, 116)
    g22 = sprites.create(assets.image`myImage2`, SpriteKind.Pipe)
    g22.setPosition(239, 116)
    ground[0].destroy()
    ground[1].destroy()
    ground = [g12, g22]
    pause(200)
}
// spawn a pipe, handing top and bottom pipe logic
function spawnPipe (x: number, y: number, top: boolean) {
    let pipe: Sprite
if (top) {
        pipe = sprites.create(assets.image`myImage1`, SpriteKind.Pipe)
    } else {
        pipe = sprites.create(assets.image`myImage`, SpriteKind.Pipe)
    }
    pipe.data.top = top
console.log(pipe.x)
    pipe.x = x
    if (top) {
        pipe.y = y - 30
    } else {
        pipe.y = y + 30
    }
    return pipe
}
function addScore (score: number) {
    name = game.askForString("Enter a name: ", 9)
    scores[name] = score
}
let name = ""
let g22: Sprite = null
let g12: Sprite = null
let vy = 0
let jump = false
let can = false
let alive = false
let pipes: Sprite[][] = []
let ground: Sprite[] = []
let jumpHeight = 0
// initialize everything
let pipe2 = null
let text = ""
let vy2 = 0
jumpHeight = determineJump()
let p1 = spawnPipe(160, 30, true)
let g1 = sprites.create(assets.image`myImage2`, SpriteKind.Pipe)
g1.setPosition(80, 116)
let g2 = sprites.create(assets.image`myImage2`, SpriteKind.Pipe)
g2.setPosition(239, 116)
ground = [g1, g2]
pipes = [[p1, spawnPipe(160, 80, false)], [spawnPipe(220, 30, true), spawnPipe(220, 80, false)], [spawnPipe(280, 30, true), spawnPipe(280, 80, false)]]
scene.setBackgroundColor(9)
alive = true
let bird = sprites.create(img`
    ..........ff........
    .......fff77f.......
    .ff...f777777f......
    f77fff77777777f.....
    f7767777777117ff....
    f76777777711f772f...
    f7677767771ff7224f..
    f7666667777777224f..
    .f777777733377244f..
    ..f77777777777444f..
    ...f77777777fff4f...
    ..fff55f5fff..fff...
    .f5555f55f...feeef..
    .f5ff555f...fefffef.
    ..f.f5ff...ffeeeeeff
    .....f.....fefffffef
    ...........feeeeeeef
    ............fffffff.
    ....................
    ....................
    `, SpriteKind.Player)
bird.scale = 0.9
let scores: {[key: string]: number} = {
    
}
// main game loop
forever(function () {
    // gravity
    if (vy < 1.5) {
        vy += 0.1
    }
    bird.y += vy
    pipes.forEach((p) => {
        p[0].x -= 1
        p[1].x -= 1
        if (p[0].x < -16) {
            info.changeScoreBy(1)
            p[0].x = 170
            p[1].x = 170
            let y = randint(10, 60)
            p[0].y = y - 30
            p[1].y = y + 80 
        }
    })
// handle resets without a whole game restart
    while (!(alive)) {
        bird.vy = 0
        bird.y = 40
        if (controller.A.isPressed()) {
            pause(1)
            if (game.ask("Do you want to see highscores?")) {
                displayScores()
            }
            reset()
            alive = true
            info.setScore(0)
        }
        pause(1)
    }
    // floor and ceiling
    if (bird.y < 0 || bird.y > 165) {
        die()
    }
    for (let g of ground) {
        g.x -= 1
if (g.right <= 0) {
            g.left = 159
        }
    }
})
