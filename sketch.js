var canvas;
var width, height;
var mondriaan;
var funky = false;

function setup(){
    var width = 500
    var height = 500
    canvas = createCanvas(width, height);
    canvas.parent('CanvasHolder')
    resetColors()
    mondriaan = new Mondriaan(width, height)
    frameRate(20)
}

function draw(){
    mondriaan.draw()
}

function makeFunky(){
    funky = true
    colorMode(HSB)
    hsbS = 60
    hsbB = 75
    color1 = [Math.random() * 360, hsbS, hsbB]
    color2 = [Math.random() * 360, hsbS, hsbB]
    color3 = [Math.random() * 360, hsbS, hsbB]
    color4 = [Math.random() * 360, hsbS, hsbB]
    color5 = [Math.random() * 360, hsbS, hsbB]
    baseColor = [Math.random() * 360, Math.random() * 10, Math.random() * 50 + 50]
    colors = [color1, color2, color3, color4, color5, baseColor, baseColor, baseColor, baseColor]
}

function resetColors(){
    funky = false
    colorMode(RGB)
    baseColor = "white"
    colors = ["rgb(202, 30, 30)", "rgb(255, 217, 0)", "rgb(40, 103, 197)", "black", "white", "white", "white", "white", "white", "white"]
}