namespace SpriteKind {
    export const Pipe = SpriteKind.create()
}

//jump logic
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    vy = -2.5
})
//spawn a pipe, handing top and bottom pipe logic
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
let pipe: Sprite = null
let vy = 0
let p1 = spawnPipe(160, 30, true)

let pipes = [
    [p1, spawnPipe(160, 80, false)],
    [spawnPipe(220, 30, true), spawnPipe(220, 80, false)],
    [spawnPipe(280, 30, true), spawnPipe(280, 80, false)],
]

let alive = true
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

//main game loop
forever(function () {

    //gravity
    if (vy < 1.5) {
        vy += 0.1
    }
    bird.y += vy

    //pipes scrolling by and resetting
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
    //handle resets without a whole game restart
    while (!(alive)) {
        bird.vy = 0
        bird.y = 40
        if (controller.A.isPressed()) {
            alive = true
            reset()
            info.setScore(0)
        }
        pause(1)
    }
    //floor and ceiling
    if (bird.y < 0 || bird.y > 165) {
        die()
    }
})

//rest the pipes and the player to their original poistions and velocity
function reset() {
    for (let p of sprites.allOfKind(SpriteKind.Pipe)) {
        p.destroy()
    }
    pipes = [
        [spawnPipe(160, 30, true), spawnPipe(160, 80, false)],
        [spawnPipe(220, 30, true), spawnPipe(220, 80, false)],
        [spawnPipe(280, 30, true), spawnPipe(280, 80, false)],
    ]

    let vy = 0
    pause(200)
}

//reusable function to kill player and display a message
function die() {
    alive = false
    game.splash("You died!", "Score: " + info.score())
}

//handle collision with pipes
sprites.onOverlap(SpriteKind.Player, SpriteKind.Pipe, (player, pipe) => {
    die()
    
})